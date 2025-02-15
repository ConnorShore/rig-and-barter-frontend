# build my docker image and publish it to docker hub
# Usage: ./build-docker.sh <version> <docker_username> <docker_password>
# Example: ./build-docker.sh latest
#!/bin/bash
set -e
VERSION=$1
DOCKER_USERNAME=$2
DOCKER_PASSWORD=$3

# Check if the version argument is provided
if [ -z "$VERSION" ]; then
  echo "Version argument is required"
  exit 1
fi

# Check if the Docker username and password are provided
if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKER_PASSWORD" ]; then
  echo "Docker username and password are required"
  exit 1
fi

# Log in to Docker Hub
echo "Logging in to Docker Hub..."
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

# Check if the login was successful
if [ $? -ne 0 ]; then
  echo "Docker login failed"
  exit 1
fi

# Build the docker image for amd64 and arm64
echo "Building and Pushing Docker image for amd64 and arm64..."
docker buildx build --platform linux/amd64,linux/arm64 -t $DOCKER_USERNAME/dev-rig-and-barter-frontend:$VERSION --push .

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Docker build failed"
  exit 1
fi
echo "Docker image dev-rig-and-barter-frontend:$VERSION built and pushed successfully"