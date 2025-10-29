# Group-1: empowHer Project

This is the **Group-1 project** of the empowHer repository.  
It is a **full-stack web application** built with **Spring Boot** (backend) and **Angular** (frontend), using **PostgreSQL** as the database.  

This project was created under the guidance of Moody's mentors and includes both theory and practical sessions.

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Database Setup](#database-setup)  
3. [Backend Setup (Spring Boot)](#backend-setup-spring-boot)  
4. [Frontend Setup (Angular)](#frontend-setup-angular)  
5. [Access the Application](#access-the-application)  
6. [Notes / Tips](#notes--tips)  

---

## Prerequisites

Before running the project, ensure you have installed:

- **Java 17+** (for Spring Boot)  
- **Maven** (for backend dependencies)  
- **Node.js + npm** (for Angular frontend)  
- **PostgreSQL** (for database)  

---

## Database Setup

1. Open PostgreSQL (psql or pgAdmin) and ensure the `postgres` database exists.
  
2. Create the schema `empowher_db` if it doesn’t exist:

```sql
CREATE SCHEMA empowher_db;
```

3. Import the provided SQL file into PostgreSQL:

```bash
psql -U postgres -d postgres -f API/Database/empowher_db.sql
```

4. Update your local credentials in application.properties:

```properties
spring.datasource.username=postgres
spring.datasource.password=your_local_password
spring.jpa.properties.hibernate.default_schema=empowher_db
```

---

## Backend Setup (Spring Boot)

1. Navigate to the backend folder: 

```bash
cd "API/Backend/demo"
```

2. Build the project using Maven: 

```bash
mvn clean install
```

3. Run the Spring Boot backend: 

```bash
mvn spring-boot:run
```

## Frontend Setup (Angular)

1. Navigate to the Angular frontend folder: 

```bash
cd "Group-1/UI/angular project/Shopping"
```
2. Install dependencies: 

```bash
npm install
```
3. Run the Angular app: 

```bash
ng serve
```

## Access the Application

1. Frontend: http://localhost:4200
2. Backend API: http://localhost:8080/api/...


## Notes/Tips

1. Make sure PostgreSQL is running before starting the backend.
2. The database export empowher_db.sql contains all tables and data.
3. If you face connection issues, double-check your username/password in application.properties.
