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

# 환경 변수 설정
ENV REACT_APP_API_BASE_URL=${API_BASE_URL}

# Build the application
RUN npm run build

# Use Nginx to serve the application
FROM nginx:latest

# Set timezone to Asia/Seoul (Debian-based)
RUN apt-get update && apt-get install -y tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone \
    && apt-get clean

# Copy built application from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
