# Build
# sudo docker build . -t AV-Tools

# Run
# sudo docker run -d -p 4620:4620 -v $(pwd)/public:/app/public --restart unless-stopped --name AV-Tools AV-Tools
# podman run -d -p 4620:4620 -v $(pwd)/public:/app/public:Z --restart unless-stopped --name av-Tools av-Tools

# Lastest node image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy all the files in the same folder as the Dockerfile
COPY ./ .

# Install node dependencies
RUN npm install

# Environment variables
ENV port=5713

# Run the app
CMD "npm" "run" "dev"