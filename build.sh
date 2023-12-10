#!/bin/sh

docker buildx build --load -t ofdistantworlds/pipboy-map:latest -f Dockerfile . && docker push ofdistantworlds/pipboy-map:latest
