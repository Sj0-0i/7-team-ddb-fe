#!/bin/bash
set -e

WEBHOOK_URL=$(aws secretsmanager get-secret-value \
  --secret-id codedeploy/discord/webhook \
  --query 'SecretString' --output text)

APP_NAME="${APPLICATION_NAME:-N/A}"
DEPLOY_GROUP="${DEPLOYMENT_GROUP_NAME:-N/A}"
ENV_NAME=$(echo "$DEPLOY_GROUP" | cut -d'-' -f2)

MESSAGE="✅ CodeDeploy 배포 성공
- 애플리케이션: $APP_NAME
- 배포 그룹: $DEPLOY_GROUP
- 환경: $ENV_NAME"

# JSON 변환
PAYLOAD=$(jq -n --arg content "$MESSAGE" '{content: $content}')

curl -H "Content-Type: application/json" \
     -X POST \
     -d "$PAYLOAD" \
     "$WEBHOOK_URL"
