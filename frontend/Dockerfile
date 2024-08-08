# Use the official Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Serve the application using a simple static file server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
