# Base image
FROM openjdk:17-jdk-alpine

# Set timezone to Asia/Seoul
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone \
    && apk del tzdata

# Copy the Spring Boot jar file to the container
COPY mini/target/mini-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the Spring Boot application with timezone configuration
ENTRYPOINT ["java","-Duser.timezone=Asia/Seoul","-jar","/app.jar"]
