# Build
# sudo docker build . -t AV-Tools

# Run
# sudo docker run -d -p 4620:4620 -v $(pwd)/public:/app/public --restart unless-stopped --name AV-Tools AV-Tools

# Lastest nginx image
FROM node:lts-alpine

# Set working directory
WORKDIR /app/server

# Copy all the files in the same folder as the Dockerfile
COPY ./server .

# Install node dependencies
RUN npm install

# Environment variables
ENV port=4620

# Run the app
CMD "npm" "start"