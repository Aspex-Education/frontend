# Security Documentation (Frontend copy)

## Frontend Security

### Token Storage

JWT tokens are stored in `localStorage`. For enhanced security in production:

1. Consider using `httpOnly` cookies if session-based auth is preferred
2. Implement token refresh mechanism
3. Clear tokens on logout

### Input Validation

- Client-side validation using Angular Reactive Forms
- Server-side validation is the primary security boundary

### XSS Protection

- Angular's built-in sanitization protects against XSS attacks
- Avoid use of `innerHTML` or unsafe DOM operations
