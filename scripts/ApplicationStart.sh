#!/bin/bash
set -e

IMAGE=$(cat /home/ubuntu/app/.image_ref)

echo "▶ 새 컨테이너 실행: $IMAGE"
docker run -d \
  --name frontend \
  -p 3000:3000 \
  "$IMAGE"
