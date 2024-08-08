# Base image
FROM openjdk:17-jdk-alpine

# Copy the Spring Boot jar file to the container
COPY mini/target/mini-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java","-jar","/app.jar"]
