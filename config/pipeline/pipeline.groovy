pipeline {
agent none
	stages {
		stage('Build') {
			agent any
			steps {
				echo 'Checkout, Build and Test ..'
				script{
					//cleanup working dir
					deleteDir()
					def build_name = "The_AtSea_Shop"
					def branch = "master"

					//variable definition
					def build_version
				}
				
				checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '368863656547', name: '368863656547', url: 'https://github.com/368863656547/368863656547.git']]])
				
				script{
					//get buildnumber
					sh script: """set +x && echo ${env.BUILD_NUMBER} > BUILD_NUMBER_JENKINS.txt"""

					//get commiter informationen
					sh 'cd app/app && mvn org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate -Dexpression=project.version | grep -v "\\[" > ../../version.txt && cd ../..'
	
					sh 'set +x && git log --format="%ae" | head -1 > commit-author-email.txt'
					sh 'set +x && git log --format="%an" | head -1 > commit-author-name.txt'
					sh 'set +x && git log --format="%h"  | head -1 > commit-revision.txt'
					commit_author_email = readFile('commit-author-email.txt').trim();
					commit_author_name = readFile('commit-author-name.txt').trim().split(' ')[0];
					commit_revision = readFile('commit-revision.txt').trim();
					BUILD_NUMBER_JENKINS = readFile('BUILD_NUMBER_JENKINS.txt').trim();
					versionfrompom = readFile('version.txt').trim();
					
					APP_VERSION_NUMBER = readFile('version.txt').trim();
					VERSION = APP_VERSION_NUMBER+"."+BUILD_NUMBER_JENKINS
					

					//set build name with unique identifier with branch, buildnumber and revision (short)
					app_name = 'The_AtSea_Shop'
					app_name_lower = 'the_atsea_shop'
					build_name = app_name + '_' + VERSION + '-' + commit_revision				
					
					currentBuild.displayName = build_name

					//set filename for nexus artifacts
					app_artifact_name = app_name_lower + '-' + VERSION + '.jar'
					echo app_artifact_name
				}
				
				lock('the_atsea_shop-app-build'){
					script{
							sh script: """
								cd app/app
								mvn clean
								mvn package
							"""
					}
				}
				
				lock('the_atsea_shop-app-test'){
					script{
						echo 'Test ..'
						
						sh script: """
							cd app/app
							mvn test
							mvn clean jacoco:prepare-agent install
							mvn jacoco:report
						"""
					}
					junit 'app/app/target/surefire-reports/*.xml'
					archiveArtifacts artifacts: 'app/app/target/*.jar', fingerprint: true
				}
				
			}		
			
		}





      stage("SonarQube Analysis") {
		agent any
		steps {
			script{
			withSonarQubeEnv('ShowcaseQube') {
				sh 'cd app/app && mvn sonar:sonar'
			}
			}
		}
      }

      stage("Quality Gate"){
		agent any
		steps{
			script{
				timeout(time: 1, unit: 'HOURS') {
					def qg = waitForQualityGate()
					if (qg.status != 'OK') {
						error "Pipeline aborted due to quality gate failure: ${qg.status}"
					}
					else
					{echo "OK"}
				}
			}
		}
      }


		stage('Docker') {
			agent any
			steps {
				echo 'Create Docker File ..'
				script{
					sh 'cd app/app && docker-compose build'
					sh 'eval `aws ecr get-login --no-include-email --region eu-central-1`'
					sh 'docker tag app_payment_gateway:latest 368863656547.dkr.ecr.eu-central-1.amazonaws.com/payment-gateway:'+ VERSION +''
					sh 'docker tag atsea_app:latest 368863656547.dkr.ecr.eu-central-1.amazonaws.com/appserver:'+ VERSION +''
					sh 'docker tag atsea_db:latest 368863656547.dkr.ecr.eu-central-1.amazonaws.com/database:'+ VERSION +''
					sh 'docker tag app_reverse_proxy:latest 368863656547.dkr.ecr.eu-central-1.amazonaws.com/reverse-proxy:'+ VERSION +''
					sh 'docker push 368863656547.dkr.ecr.eu-central-1.amazonaws.com/reverse-proxy:'+ VERSION +''
					sh 'docker push 368863656547.dkr.ecr.eu-central-1.amazonaws.com/payment-gateway:'+ VERSION +''
					sh 'docker push 368863656547.dkr.ecr.eu-central-1.amazonaws.com/database:'+ VERSION +''
					sh 'docker push 368863656547.dkr.ecr.eu-central-1.amazonaws.com/appserver:'+ VERSION +''
				}
				
			}		
			
		}

		stage('Trigger Deployment') {
			agent none
			steps {
				milestone(1)
				echo 'Deployment..'
				script{
					def tag = input message: 'Deploy to kubernetes?', ok: 'Promotion'
				}
			}
		}

		stage('Deployment') {
			agent any
			steps {		
				script{
					echo 'Deployment..'

					sh'ssh -i ~/KOPSinstance.pem ec2-user@172.31.43.137 "kubectl set image deployments/appserver appserver=368863656547.dkr.ecr.eu-central-1.amazonaws.com/appserver:'+ VERSION +'"'
					//sh'ssh -i ~/KOPSinstance.pem ec2-user@172.31.43.137 "kubectl set image deployments/database database=368863656547.dkr.ecr.eu-central-1.amazonaws.com/database:'+ VERSION +'"'
					sh'ssh -i ~/KOPSinstance.pem ec2-user@172.31.43.137 "kubectl set image deployments/payment-gateway payment-gateway=368863656547.dkr.ecr.eu-central-1.amazonaws.com/payment-gateway:'+ VERSION +'"'

					sh'sleep 10s'

					sh'ssh -i ~/KOPSinstance.pem ec2-user@172.31.43.137 "kubectl rollout status deployments/appserver"'
					//sh'ssh -i ~/KOPSinstance.pem ec2-user@172.31.43.137 "kubectl rollout status deployments/database"'
					sh'ssh -i ~/KOPSinstance.pem ec2-user@172.31.43.137 "kubectl rollout status deployments/payment-gateway"'

				}
			}
		}

	}
}

