# Architecture Diagram (Frontend)

## Frontend Overview

This file contains the frontend-focused parts of the architecture extracted from the root architecture document.

```
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
```

### Frontend Details

- Framework: Angular 17 (standalone components)
- Features: Login page, Register page, Auth service, Reactive forms, RxJS state
- Token storage: `localStorage` (see SECURITY.md for recommendations)
