#!/bin/bash

# package.json에서 버전 추출
VERSION=$(node -p "require('./package.json').version")

# STEP: 도커 이미지 빌드
docker build -t gcr.io/photogether-d3c95/web:${VERSION} .

# STEP: gcr.io 도커 허브에 이미지 푸쉬
docker push gcr.io/photogether-d3c95/web:${VERSION}
