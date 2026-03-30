# Smart Parking

A Spring Boot application for managing parking spot reservations and payments.

## Features

- User registration and authentication
- Browse available parking spots
- Create and manage reservations
- Online payment processing
- Dashboard with booking overview
- Admin panel for spot management

## Tech Stack

- **Backend**: Spring Boot 4.1.0-SNAPSHOT
- **Database**: Aiven MySQL (production) / H2 (development)
- **ORM**: Hibernate 7.2.7.Final with JPA
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Spring Security with custom user validation

## Setup & Running

### Prerequisites
- Java 21
- Maven
- MySQL (or use H2 for development)

### Environment Variables
```
SPRING_DATASOURCE_PASSWORD=your_mysql_password
```

### Build & Run
```bash
./mvnw clean install
./mvnw spring-boot:run
```

Application will start on `http://localhost:8080`

## Default Endpoints

- **Auth**: POST `/api/auth/register`, POST `/api/auth/login`
- **Parking**: GET `/api/parking/spots`, GET `/api/parking/spots/available`
- **Reservations**: POST `/api/reservations/create`, GET `/api/reservations/user/{userId}`
- **Payment**: POST `/api/reservations/{id}/pay`

## Database Configuration

### MySQL (Production)
```properties
spring.datasource.url=jdbc:mysql://your-host:port/database?sslMode=REQUIRED
spring.datasource.username=avnadmin
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

### H2 (Development)
```properties
spring.datasource.url=jdbc:h2:mem:parking_db
spring.datasource.driver-class-name=org.h2.Driver
```

## Project Structure

```
src/
├── main/
│   ├── java/com/parking/smartparking/
│   │   ├── SmartparkingApplication.java
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── resources/
│       ├── static/ (HTML, CSS, JS)
│       └── application.properties
└── test/
```

## License

MIT
