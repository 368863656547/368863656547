#!/bin/bash
cd "${0%/*}"
kops get ig nodes -oyaml > nodes.yaml
sed -i "s/maxSize: .*/maxSize: 10/g" ./nodes.yaml
sed -i "s/minSize: .*/minSize: 2/g" ./nodes.yaml
kops replace -f nodes.yaml
kops rolling-update cluster --yes