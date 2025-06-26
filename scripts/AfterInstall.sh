#!/bin/bash
set -e

echo "▶ AWS CLI 설치 확인 및 ECR 로그인"
if ! command -v aws &> /dev/null; then
  echo "AWS CLI가 설치되어 있지 않아 설치합니다."
  curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip -q awscliv2.zip
  sudo ./aws/install
  rm -rf aws awscliv2.zip
fi

AWS_REGION="ap-northeast-2"
ACCOUNT_ID=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | grep accountId | awk -F\" '{print $4}')
REPO_NAME="dolpin-frontend-${DEPLOYMENT_GROUP_NAME##*-}"  # 예: dev 또는 prod
IMAGE_TAG=$(cat /home/ubuntu/app/.image_tag)
IMAGE="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${IMAGE_TAG}"

aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "▶ 이미지 풀"
docker pull "$IMAGE"

echo "$IMAGE" > /home/ubuntu/app/.image_ref
