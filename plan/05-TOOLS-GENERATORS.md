# Step 5: Utility Tools - Generators & Templates

## Objective

Implement password generator, JWT secret generator, and template system.

## 5.1 Password Generator

### Features

- [ ] Configurable length (8-32 characters)
- [ ] Toggle options:
  - Include uppercase (A-Z)
  - Include lowercase (a-z)
  - Include numbers (0-9)
  - Include symbols (!@#$%^&*)
  - Exclude confusing chars (O, 0, l, 1, I)
- [ ] Generate button with loading state
- [ ] Copy generated password
- [ ] Save to project (optional)
- [ ] History of generated passwords (current session)
- [ ] Regenerate button

### Page

- `src/app/dashboard/tools/password-generator/page.tsx`

### Component

- `src/components/tools/PasswordGenerator.tsx`

## 5.2 JWT Secret Generator

### Features

- [ ] Generate access token secret (64+ chars)
- [ ] Generate refresh token secret (64+ chars)
- [ ] Generate both together
- [ ] Customizable length
- [ ] Copy individual secrets
- [ ] Copy formatted:

  ```env
  JWT_ACCESS_SECRET=...
  JWT_REFRESH_SECRET=...
  ```

- [ ] Save to project
- [ ] Show strength indicator

### Page

- `src/app/dashboard/tools/jwt-generator/page.tsx`

### Component

- `src/components/tools/JWTGenerator.tsx`

## 5.3 Environment Templates

### Built-in Templates

#### Template 1: Next.js + MongoDB + Better Auth

```env
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

#### Template 2: MERN Stack

```env
PORT=5000
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=
```

#### Template 3: Cloudinary Integration

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Template 4: Stripe

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

#### Template 5: Firebase

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### Template 6: AWS Integration

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

#### Template 7: GitHub OAuth

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
```

#### Template 8: Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Features

- [ ] Browse available templates
- [ ] Search templates
- [ ] Create project from template
- [ ] Populate project with template variables
- [ ] Create custom templates
- [ ] Save custom templates to database
- [ ] Share templates (optional)

### Pages

- `src/app/dashboard/templates/page.tsx`
- `src/app/dashboard/templates/[id]/page.tsx`

### Components

- `src/components/templates/TemplateCard.tsx`
- `src/components/templates/TemplateList.tsx`
- `src/components/templates/UseTemplateModal.tsx`

### Database Model

- Template model (already defined in Step 2)

## 5.4 Utilities Implementation

### Functions

- `utils/generators.ts`:
  - `generatePassword(options)`
  - `generateJWTSecret(length)`
  - `generateRandomString(length)`

- `utils/templates.ts`:
  - `getBuiltInTemplates()`
  - `applyTemplate(projectId, templateId)`
  - `createCustomTemplate(data)`

## API Routes

```
GET    /api/templates
GET    /api/templates/:id
POST   /api/templates/custom
POST   /api/projects/:id/apply-template/:templateId
POST   /api/generators/password
POST   /api/generators/jwt
```

## Success Criteria

- ✅ Password generator creates strong passwords
- ✅ JWT secrets are 64+ characters
- ✅ Templates load correctly
- ✅ Can create project from template
- ✅ All copy functions work
- ✅ Confusing characters excluded from passwords

## Time Estimate: 1.5-2 hours
