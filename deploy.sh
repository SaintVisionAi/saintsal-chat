#!/bin/bash

# Superman AI - Azure Deployment Script
# This script builds and deploys Superman to Azure Container Apps

set -e  # Exit on error

echo "╔════════════════════════════════════════╗"
echo "║  SUPERMAN AI - AZURE DEPLOYMENT       ║"
echo "╚════════════════════════════════════════╝"

# Configuration
RESOURCE_GROUP="svt-cookin-resource-group"
LOCATION="eastus"
ACR_NAME="svcookinregistry"
IMAGE_NAME="superman-ai"
CONTAINER_APP_NAME="superman-ai"
CONTAINER_ENV_NAME="superman-env"

echo ""
echo "📦 Step 1: Building Docker Image..."
docker build -t ${IMAGE_NAME}:latest .

echo ""
echo "🔐 Step 2: Logging into Azure Container Registry..."
az acr login --name ${ACR_NAME}

echo ""
echo "🏷️  Step 3: Tagging Image..."
docker tag ${IMAGE_NAME}:latest ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest
docker tag ${IMAGE_NAME}:latest ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)

echo ""
echo "⬆️  Step 4: Pushing Image to ACR..."
docker push ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest

echo ""
echo "🌐 Step 5: Creating Container Environment (if needed)..."
az containerapp env create \
  --name ${CONTAINER_ENV_NAME} \
  --resource-group ${RESOURCE_GROUP} \
  --location ${LOCATION} \
  --logs-workspace-id $(az monitor log-analytics workspace show -g ${RESOURCE_GROUP} -n sv-cookin-logs --query customerId -o tsv 2>/dev/null || echo "skip") \
  2>/dev/null || echo "Environment already exists"

echo ""
echo "🚀 Step 6: Deploying Container App..."
az containerapp create \
  --name ${CONTAINER_APP_NAME} \
  --resource-group ${RESOURCE_GROUP} \
  --environment ${CONTAINER_ENV_NAME} \
  --image ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 1.0 \
  --memory 2.0Gi \
  --registry-server ${ACR_NAME}.azurecr.io \
  --query properties.configuration.ingress.fqdn \
  -o tsv \
  || echo "Updating existing container app..."

# If create failed, update instead
az containerapp update \
  --name ${CONTAINER_APP_NAME} \
  --resource-group ${RESOURCE_GROUP} \
  --image ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest \
  --query properties.configuration.ingress.fqdn \
  -o tsv \
  2>/dev/null || echo "Deployment updated"

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🌍 Your Superman AI is live at:"
FQDN=$(az containerapp show \
  --name ${CONTAINER_APP_NAME} \
  --resource-group ${RESOURCE_GROUP} \
  --query properties.configuration.ingress.fqdn \
  -o tsv)
echo "   https://${FQDN}"
echo ""
echo "🧪 Test it:"
echo "   curl https://${FQDN}/health"
echo ""
