# Multi-stage Dockerfile for Smart Parking Spring Boot Application
# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the JAR file from builder stage
COPY --from=builder /app/target/smartparking-*.jar app.jar

# Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
USER appuser

# Expose port (Render will set the PORT environment variable)
EXPOSE 8080

# Run the application with dynamic port and explicit host binding for Render
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080} --server.address=0.0.0.0"]
