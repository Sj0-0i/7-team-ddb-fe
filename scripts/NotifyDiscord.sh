#!/bin/bash
set -e

WEBHOOK_URL=$(aws secretsmanager get-secret-value \
  --secret-id codedeploy/discord/webhook \
  --query SecretString --output text)

MESSAGE="✅ CodeDeploy 배포 성공
- 애플리케이션: $APPLICATION_NAME
- 배포 그룹: $DEPLOYMENT_GROUP_NAME
- 환경: $(echo $DEPLOYMENT_GROUP_NAME | cut -d'-' -f2)
"

curl -H "Content-Type: application/json" \
     -X POST \
     -d "{\"content\": \"$MESSAGE\"}" \
     "$WEBHOOK_URL"
