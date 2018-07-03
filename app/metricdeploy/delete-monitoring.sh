#!/bin/bash

HEAPSTER_FILE="./heapster.yaml"
DASHBOARD_FILE="./dashboard.yaml"
PROMETHEUS_FILE="./prometheus.yaml"
GRAFANA_FILE="./grafana.yaml"
SERVICE_FILE="./service-connector.yaml"
WEAVE_FILE="./weave-scope.yaml"

kubectl delete -f ${HEAPSTER_FILE} 2>/dev/null
kubectl delete -f ${DASHBOARD_FILE} 2>/dev/null
kubectl delete -f ${PROMETHEUS_FILE} 2>/dev/null
kubectl delete -f ${GRAFANA_FILE} 2>/dev/null
kubectl delete -f ${SERVICE_FILE} 2>/dev/null
kubectl delete -f ${WEAVE_FILE} 2>/dev/null

kubectl delete namespace monitoring 2>/dev/null
