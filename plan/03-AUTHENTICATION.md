# Step 3: Authentication System with Better Auth

## Objective

Implement secure user authentication using Better Auth with MongoDB. All in one Next.js project (no separate backend).

## Better Auth Setup

Better Auth is a comprehensive TypeScript authentication framework. Unlike NextAuth, it provides:

- Built-in password hashing
- Session management
- OAuth support
- Email verification
- 2FA/MFA ready
- Multi-tenant ready
- Zero external dependencies for core features

## Features to Implement

### 3.1 Initialize Better Auth

- [ ] Create `src/lib/auth.ts` with Better Auth configuration
- [ ] Setup MongoDB connection
- [ ] Configure secret: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`
- [ ] Setup session strategy (sessionToken or jwt)
- [ ] Configure plugins (email verification, etc)

**Example Configuration (src/lib/auth.ts):**

```typescript
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(process.env.MONGODB_URI!),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true for MVP+
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every 24 hours
    cookieCache: {
      disabled: false,
    },
  },
});
```

### 3.2 User Registration

- [ ] Create signup page at `/auth/signup`
- [ ] Use Better Auth client: `useAuthClient()` hook
- [ ] Validate input with Zod schema
- [ ] Call `auth.signUp()` method
- [ ] Handle success/error responses
- [ ] Redirect to dashboard on success

### 3.3 User Login

- [ ] Create login page at `/auth/login`
- [ ] Use Better Auth client
- [ ] Call `auth.signIn()` method
- [ ] Create session automatically
- [ ] Redirect to dashboard
- [ ] Persistent login with HTTP-only cookies

### 3.4 Session Management

- [ ] Setup Better Auth client wrapper in root layout
- [ ] Create `useAuthClient()` hook for client components
- [ ] Create `getSession()` server function for server components
- [ ] Implement protected routes middleware
- [ ] Add logout functionality: `auth.signOut()`
- [ ] Session expiry and refresh handling

### 3.5 Security Features

- [ ] CSRF protection (built-in with Better Auth)
- [ ] Secure password hashing (bcrypt, built-in)
- [ ] Rate limiting on auth endpoints
- [ ] Secure HTTP-only cookies
- [ ] Password validation (min 8 chars, etc)
- [ ] Email verification (optional for MVP)

## API Routes (Better Auth Handles These)

Better Auth automatically creates these routes:

```
POST   /api/auth/sign-up
POST   /api/auth/sign-in
POST   /api/auth/sign-out
GET    /api/auth/session
POST   /api/auth/sign-in/email
```

Create route handler:

```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";

export const { GET, POST } = auth.toNextJsHandler();
```

## Components to Create

- `src/components/auth/SignupForm.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/AuthProvider.tsx`
- `src/app/auth/signup/page.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/error/page.tsx`

## Files to Create

- `src/lib/auth.ts` (Better Auth configuration)
- `src/lib/auth-client.ts` (Better Auth client for frontend)
- `src/app/api/auth/[...all]/route.ts` (API handler)
- `src/middleware.ts` (Protected routes)
- `src/hooks/useSession.ts` (Session hook)
- `src/utils/password.ts` (password validation)

## Dependencies

```bash
pnpm add better-auth@latest
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
pnpm add -D @types/bcryptjs
```

## Environment Variables

```env
# Better Auth
BETTER_AUTH_SECRET=generate_with_openssl_rand_base64_32
BETTER_AUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

**Generate BETTER_AUTH_SECRET:**

```bash
openssl rand -base64 32
```

## Setup Instructions

1. **Configure Better Auth** in `src/lib/auth.ts`
2. **Create API handler** at `src/app/api/auth/[...all]/route.ts`
3. **Setup client** in `src/lib/auth-client.ts` for frontend usage
4. **Create components** for signup, login, protected routes
5. **Add middleware** for route protection
6. **Test with manual signup/login**

## Example Client Usage

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from \"better-auth/react\";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// In components:
const { data: session } = useSession();
const { signIn, signUp, signOut } = authClient;
```\n\n## Success Criteria\n\n- ✅ User can register with validation\n- ✅ User can login securely\n- ✅ Sessions persist across page reloads (HTTP-only cookies)\n- ✅ Protected routes work correctly\n- ✅ Logout clears session\n- ✅ Password hashed with bcrypt in database\n- ✅ CSRF protection enabled by default\n\n## Time Estimate: 1.5-2 hours
