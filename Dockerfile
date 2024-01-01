# Docker
# cd /home/trey/av-server
# sudo docker build . -t av-server
# sudo docker stop av-server
# sudo docker rm av-server
# sudo docker run -d --name av-server --hostname av-server -p 4620:4620 -v /home/trey/av-server/server:/app/server -v /home/trey/av-server/public:/app/public -v /home/trey/av-server/private:/app/private av-server

# Podman
# podman build -f dev.Dockerfile . -t av-server
# podman stop av-server
# podman rm av-server
# podman run -d --name av-server --hostname av-server -p 4620:4620 -v $(pwd)/public:/app/public -v $(pwd)/private:/app/private av-server

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
CMD "npm" "start"
