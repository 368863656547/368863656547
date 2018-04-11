#!/bin/bash
cd "${0%/*}"
aws iam create-policy --policy-document file://asg-policy.json --policy-name ClusterAutoScaling
aws iam attach-role-policy --role-name nodes.k8s-showcase.cluster.k8s.local --policy-arn arn:aws:iam::`aws sts get-caller-identity --output text --query 'Account'`:policy/ClusterAutoScaling