# Step 3: Authentication System

## Objective

Implement secure user authentication using Better Auth / NextAuth with MongoDB.

## Features to Implement

### 3.1 Authentication Provider Setup

- [ ] Configure NextAuth/Better Auth
- [ ] Setup JWT secrets: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [ ] Configure MongoDB adapter
- [ ] Setup session callbacks

### 3.2 User Registration

- [ ] Create signup page at `/auth/signup`
- [ ] Validate input with Zod schema
- [ ] Hash passwords using bcrypt
- [ ] Create user in database
- [ ] Handle email validation (optional for MVP)

### 3.3 User Login

- [ ] Create login page at `/auth/login`
- [ ] Verify credentials
- [ ] Create session
- [ ] Redirect to dashboard
- [ ] Persistent login with cookies

### 3.4 Session Management

- [ ] Setup session provider wrapper
- [ ] Create `useSession()` hook
- [ ] Implement protected routes middleware
- [ ] Add logout functionality
- [ ] Session expiry handling

### 3.5 Security Features

- [ ] CSRF protection
- [ ] Secure password hashing (bcrypt)
- [ ] Rate limiting on login attempts
- [ ] Secure session storage
- [ ] Password validation rules

## API Routes

### 3.6 Authentication Routes

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/session
```

## Components to Create

- `src/components/auth/SignupForm.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/app/auth/signup/page.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/error/page.tsx`

## Files to Create

- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/auth.ts`
- `src/middleware.ts`
- `src/hooks/useSession.ts`
- `src/utils/password.ts` (validation & hashing)

## Dependencies

```bash
pnpm add next-auth @auth/mongodb-adapter bcryptjs
pnpm add -D @types/bcryptjs
```

## Environment Variables

```env
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri
```

## Success Criteria

- ✅ User can register with validation
- ✅ User can login securely
- ✅ Sessions persist across page reloads
- ✅ Protected routes work correctly
- ✅ Logout clears session
- ✅ Password hashed in database

## Time Estimate: 1.5-2 hours
