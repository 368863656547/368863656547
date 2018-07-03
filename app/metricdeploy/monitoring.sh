#!/bin/bash

HEAPSTER_FILE="./heapster.yaml"
DASHBOARD_FILE="./dashboard.yaml"
PROMETHEUS_BUNDLE_FILE="./prometheus-bundle.yaml"
PROMETHEUS_FILE="./prometheus.yaml"
GRAFANA_FILE="./grafana.yaml"
SERVICE_FILE="./service-connector.yaml"
WEAVE_FILE="./weave-scope.yaml"

# create MONITORING namespace if not exists
# namespace could have been terminated. Need to wait until it's completely gone
# skipping if namespace is Active or missing
while [ "$(kubectl get namespace monitoring 2>/dev/null | tail -n 1 | awk '{print $2}')" == "Terminating" ]; do
  sleep 1s
done

if ! kubectl get namespace monitoring &>/dev/null; then
  kubectl create namespace monitoring
fi

# deploy heapster with influxdb if not exists
if ! kubectl get -f ${HEAPSTER_FILE} &>/dev/null; then
  kubectl create -f ${HEAPSTER_FILE}
fi

# deploy k8s dashboard if not exists
if ! kubectl get -f ${DASHBOARD_FILE} &>/dev/null; then
  kubectl create -f ${DASHBOARD_FILE}
fi

# deploy prometheus if not exists
if ! kubectl get -f ${PROMETHEUS_BUNDLE_FILE} &>/dev/null && ! kubectlget -f §{PROMETHEUS_FILE} &>/dev/null; then
  kubectl create -f ${PROMETHEUS_BUNDLE_FILE}
  # Warten bis Prometheus-Operater-Pod auf jeden Fall läuft
  sleep 30s
  kubectl create -f ${PROMETHEUS_FILE}
fi

# deploy grafana if not exists
if ! kubectl get -f ${GRAFANA_FILE} &>/dev/null; then
  kubectl create -f ${GRAFANA_FILE}
fi

# deploy connector-service for grafana-heapster
if ! kubectl get -f ${SERVICE_FILE} &>/dev/null; then
  kubectl create -f ${SERVICE_FILE}
fi

if ! kubectl get -f ${WEAVE_FILE} &>/dev/null; then
  kubectl create -f ${WEAVE_FILE}
fi

# enable metrics for cloudwatch
aws autoscaling enable-metrics-collection --auto-scaling-group-name="nodes.k8s-showcase.cluster.k8s.local" --granularity "1Minute"
aws autoscaling enable-metrics-collection --auto-scaling-group-name="master-eu-central-1a.masters.k8s-showcase.cluster.k8s.local" --granularity "1Minute"