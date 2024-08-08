# Use the official Node.js base image for building the application
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Remove .env file if it exists
RUN rm -f .env

# Build the application
RUN npm run build

# Use Nginx to serve the application
FROM nginx:alpine

# Copy built application from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
