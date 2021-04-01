FROM node:15.12-alpine3.13

# Create app directory
RUN mkdir -p /app

# Copy list of project dependencies
WORKDIR /app
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy frontend files and run app
COPY . ./
EXPOSE 3000
CMD ["npm", "start"]

# Manual setup
# sudo docker build . -t frontend-image
# sudo docker run -p 3000:3000 --name frontend-container frontend-image:latest
