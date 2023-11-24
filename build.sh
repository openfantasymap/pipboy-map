#!/bin/sh

docker buildx build --load -t ofdistantworlds/cbrpnk-map:latest -f Dockerfile . && docker push ofdistantworlds/cbrpnk-map:latest
