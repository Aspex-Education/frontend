# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ASPEX EDUCATION PLATFORM                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐                  ┌──────────────────────┐
│   Frontend Monorepo  │                  │   Backend Monorepo   │
│     (Angular 17)     │◄────── HTTP ────►│   (Java/Spring)      │
└──────────────────────┘   (REST/JSON)    └──────────────────────┘
         │                                          │
         │                                          │
         ▼                                          ▼
┌──────────────────────┐                  ┌──────────────────────┐
│    Auth Module       │                  │   Auth Microservice  │
│  ┌────────────────┐  │                  │  ┌────────────────┐  │
│  │ Login Page     │  │                  │  │ Infrastructure │  │
│  │ Register Page  │  │                  │  │   REST API     │  │
│  │ Auth Service   │  │                  │  │   Security     │  │
│  │ Token Manager  │  │                  │  │   Database     │  │
│  └────────────────┘  │                  │  └────────┬───────┘  │
└──────────────────────┘                  │           │          │
                                          │  ┌────────▼───────┐  │
                                          │  │  Application   │  │
                                          │  │   Use Cases    │  │
                                          │  │   DTOs         │  │
                                          │  └────────┬───────┘  │
                                          │           │          │
                                          │  ┌────────▼───────┐  │
                                          │  │    Domain      │  │
                                          │  │   Entities     │  │
                                          │  │   Services     │  │
                                          │  │   Ports        │  │
                                          │  └────────────────┘  │
                                          └──────────────────────┘
```

## Backend - Hexagonal Architecture

```
                    ┌─────────────────────────────────┐
                    │   Infrastructure Layer          │
                    │                                 │
                    │  ┌──────────────────────────┐   │
                    │  │  Inbound Adapters        │   │
                    │  │  - REST Controllers      │   │
                    │  │  - Exception Handlers    │   │
                    │  └──────────┬───────────────┘   │
                    │             │                   │
                    │  ┌──────────▼───────────────┐   │
                    │  │  Application Layer       │   │
                    │  │  - Use Cases             │   │
                    │  │  - DTOs                  │   │
                    │  └──────────┬───────────────┘   │
                    │             │                   │
                    │  ┌──────────▼───────────────┐   │
                    │  │  Domain Layer (Core)     │   │
                    │  │  - Entities (User)       │   │
                    │  │  - Domain Services       │   │
                    │  │  - Ports (Interfaces)    │   │
                    │  └──────────┬───────────────┘   │
                    │             │                   │
                    │  ┌──────────▼───────────────┐   │
                    │  │  Outbound Adapters       │   │
                    │  │  - JPA Repository        │   │
                    │  │  - Password Encoder      │   │
                    │  │  - JWT Token Generator   │   │
                    │  └──────────────────────────┘   │
                    │                                 │
                    └─────────────────────────────────┘
```

## Data Flow - Registration

```
1. User fills form
   │
   ▼
2. Angular validates input
   │
   ▼
3. POST /api/auth/register
   │
   ▼
4. REST Controller receives request
   │
   ▼
5. RegisterUserUseCase.execute()
   │
   ▼
6. AuthenticationDomainService.registerUser()
   │
   ├──► Check name exists (UserRepositoryPort)
   ├──► Check email exists (UserRepositoryPort)
   ├──► Encode password (PasswordEncoderPort)
   ├──► Create User entity
   └──► Save user (UserRepositoryPort)
   │
   ▼
7. Return AuthResponse
   │
   ▼
8. Angular displays success message
   │
   ▼
9. Redirect to login page
```

## Data Flow - Login

```
1. User enters credentials
   │
   ▼
2. Angular validates input
   │
   ▼
3. POST /api/auth/login
   │
   ▼
4. REST Controller receives request
   │
   ▼
5. LoginUserUseCase.execute()
   │
   ▼
6. AuthenticationDomainService.authenticateUser()
   │
   ├──► Find user by email (UserRepositoryPort)
   ├──► Verify password (PasswordEncoderPort)
   ├──► Check user is active
   └──► Generate JWT token (TokenGeneratorPort)
   │
   ▼
7. Return AuthResponse with token
   │
   ▼
8. Client stores access token in memory or uses HttpOnly secure cookie (recommended)
   │
   ▼
9. Update currentUser observable
   │
   ▼
10. Redirect to home page
```
