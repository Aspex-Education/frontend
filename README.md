# Aspex Education Frontend

Angular-based frontend monorepo for Aspex Education platform.

## Project Overview

This is the frontend application for the Aspex Education platform, built with Angular 19. It provides a modern, responsive user interface for the authentication and education features.

## Features

- **User Authentication**
  - User Registration
  - User Login
  - JWT Token Management
  - Protected Routes

## Architecture

The frontend follows Angular best practices with a modular structure:

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/                    # Authentication Module
│   │   │   ├── login/               # Login Component
│   │   │   ├── register/            # Register Component
│   │   │   ├── services/            # Auth Service
│   │   │   └── models/              # Type Definitions
│   │   ├── app.component.*          # Root Component
│   │   ├── app.config.ts            # App Configuration
│   │   └── app.routes.ts            # Routing Configuration
│   ├── assets/                      # Static Assets
│   └── styles.css                   # Global Styles
├── angular.json                     # Angular Configuration
├── package.json                     # Dependencies
└── README.md                        # This File
```

## Prerequisites

- Node.js 18+ or higher
- npm 9+ or higher
- Angular CLI 17+

## Getting Started

### Install Dependencies

```bash
cd frontend
npm install
```

### Development Server

Run the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

The frontend is configured to connect to the backend API running on `http://localhost:8080`.

To change the API URL, update the `apiUrl` in:
- `src/app/auth/services/auth.service.ts`

## Available Routes

- `/auth/login` - User login page
- `/auth/register` - User registration page
- `/` - Redirects to login page

## Components

### Login Component
Handles user authentication with form validation and error handling.

### Register Component
Handles new user registration with comprehensive form validation.

### Auth Service
Manages authentication state, API calls, and JWT token storage.

## Technology Stack

- **Angular 19** - Frontend Framework
- **RxJS** - Reactive Programming
- **TypeScript 5.8** - Programming Language
- **Angular Forms** - Form Handling
- **HttpClient** - HTTP Communication

## Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use:
```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## Running Tests

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Documentation](https://angular.io/cli).

