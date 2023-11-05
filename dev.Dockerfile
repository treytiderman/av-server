# Docker
# sudo docker build -f dev.Dockerfile . -t av-server-dev
# sudo docker stop av-server-dev
# sudo docker rm av-server-dev
# sudo docker run -d --name av-server-dev --hostname av-server-dev -p 4622:4620 -v $(pwd)/server:/app/server -v $(pwd)/public:/app/public -v $(pwd)/private:/app/private av-server-dev

# Podman
# podman build -f dev.Dockerfile . -t av-server-dev
# podman stop av-server-dev
# podman rm av-server-dev
# podman run -d --name av-server-dev --hostname av-server-dev -p 4622:4620 -v $(pwd)/server:/app/server -v $(pwd)/public:/app/public -v $(pwd)/private:/app/private av-server-dev

# Lastest node image
FROM node:lts-alpine
ENV TZ="America/Chicago"

# Set working directory
WORKDIR /app/server

# Copy all the files in to the container
COPY ./server .
COPY ./public ../public
COPY ./private ../private

# Install node dependencies
RUN npm install
RUN apk add g++ make py3-pip

# Run the app
CMD "npm" "run" "dev"
