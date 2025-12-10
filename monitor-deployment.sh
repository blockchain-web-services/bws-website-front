#!/bin/bash

RUN_ID="20092218334"
REPO="blockchain-web-services/bws-website-front"

echo "Monitoring deployment workflow: $RUN_ID"
echo "=========================================="

while true; do
  STATUS=$(gh run view $RUN_ID --repo $REPO --json status,conclusion 2>&1)

  if echo "$STATUS" | grep -q "could not resolve to a Repository"; then
    echo "Error accessing repository"
    exit 1
  fi

  WORKFLOW_STATUS=$(echo "$STATUS" | jq -r '.status' 2>/dev/null)
  CONCLUSION=$(echo "$STATUS" | jq -r '.conclusion' 2>/dev/null)

  TIMESTAMP=$(date '+%H:%M:%S')

  if [ "$WORKFLOW_STATUS" = "completed" ]; then
    echo "[$TIMESTAMP] ✅ Deployment completed with conclusion: $CONCLUSION"
    exit 0
  elif [ "$WORKFLOW_STATUS" = "in_progress" ]; then
    echo "[$TIMESTAMP] 🔄 Deployment in progress..."
  else
    echo "[$TIMESTAMP] Status: $WORKFLOW_STATUS"
  fi

  sleep 30
done
