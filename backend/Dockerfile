# Base image
FROM openjdk:17-jdk-alpine

# Set the working directory
WORKDIR /mini

# Copy the Spring Boot jar file to the container
COPY target/mini-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java","-jar","/mini/app.jar"]
