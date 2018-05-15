#! /bin/bash

# check if aws cli is installed
if ! hash aws; then
  echo "aws cli not installed"
  exit 1
fi

function allow_ingress {
  local IP_Port="30900-30905"
  local IP_Protocol="tcp"
  local IP_Allowed="139.2.0.0/16"
  local AWS_SecGroupId_Master=$(aws ec2 describe-security-groups --filter Name=group-name,Values="masters.k8s-showcase.cluster.k8s.local" --query "SecurityGroups[*].GroupId")

  echo "Allowing ${IP_Allowed} on Port ${IP_Port} for ${AWS_SecGroupId_Master}"
  aws ec2 authorize-security-group-ingress --group-id=${AWS_SecGroupId_Master} --protocol=${IP_Protocol} --port=${IP_Port} --cidr=${IP_Allowed}
}

function change_autoscaling {
  local SCALING_Max=10
  local SCALING_Min=2
  local SCALING_Warmup_Time=300
  local SCALING_Policy_Name="CPU-Utilisation"
  local SCALING_Group_Name="nodes.k8s-showcase.cluster.k8s.local"

  # change upper and lower scaling limit
  echo "Modifying AutoscalingGroup ${SCALING_Group_Name}: Min=${SCALING_Min}, Max=${SCALING_Max}"
  aws autoscaling update-auto-scaling-group --auto-scaling-group-name=${SCALING_Group_Name} --max-size=${SCALING_Max} --min-size=${SCALING_Min}

  # add autoscaling policy
  echo "Creating scaling-policy ${SCALING_Policy_Name} for ${SCALING_Group_Name}"
  aws autoscaling put-scaling-policy --auto-scaling-group-name=${SCALING_Group_Name} --estimated-instance-warmup=${SCALING_Warmup_Time} --policy-name=${SCALING_Policy_Name} --policy-type=TargetTrackingScaling --target-tracking-configuration='{"PredefinedMetricSpecification": {"PredefinedMetricType": "ASGAverageCPUUtilization"}, "TargetValue": 80.0, "DisableScaleIn": false}' > /dev/null
}

function enable_cw_metrics {
  local cluster_name="k8s-showcase.cluster.k8s.local"

  echo "Enabling metric-collection for cluster scaling-groups"
  aws autoscaling enable-metrics-collection --auto-scaling-group-name="nodes.${cluster_name}" --granularity "1Minute"
  aws autoscaling enable-metrics-collection --auto-scaling-group-name="master-eu-central-1a.masters.${cluster_name}" --granularity "1Minute"
}

allow_ingress
change_autoscaling
enable_cw_metrics
