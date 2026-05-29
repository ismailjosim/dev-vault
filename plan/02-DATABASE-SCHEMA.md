# Step 2: Database Schema & Models

## Objective

Design and implement MongoDB schemas for projects, environment variables, and related data structures.

## Database Models

**Note:** User authentication is handled by Better Auth framework. Better Auth automatically creates and manages the User collection in MongoDB. You do NOT need to create your own User model.

### 2.1 User Settings Schema (Optional - Custom User Preferences)

**Better Auth User (Automatic):**

- Better Auth creates users in MongoDB automatically
- Stores: email, passwordHash, name, image, emailVerified, createdAt, updatedAt
- Handles password hashing, session management, and authentication

```javascript
// Optional: src/models/UserSettings.ts
{
  _id: ObjectId,
  betterAuthUserId: String (Better Auth user ID),
  email: String (unique),
  theme: String (light, dark, system),
  autoLockTimeout: Number,
  defaultExportFormat: String,
  defaultCopyFormat: String,
  clipboardClearTimeout: Number,
  emailNotifications: {
    expiringCredentials: Boolean,
    loginAlerts: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 Project Schema

```javascript
{
  _id: ObjectId,
  userId: String (Better Auth user ID from session),
  projectName: String,
  slug: String (unique, auto-generated),
  description: String,
  category: String (Full Stack, Frontend, Backend),
  framework: String (Next.js, MERN, etc),
  tags: [String],
  isPinned: Boolean,
  envVariables: [ObjectId] (ref: EnvVariable),
  environments: [String] (development, production, staging),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.3 EnvVariable Schema

```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Project),
  key: String,
  value: String (encrypted with AES-256),
  type: String (secret, jwt, api_key, url, other),
  isPublic: Boolean,
  note: String,
  environment: String (dev, prod, staging, test),
  expiryDate: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.4 Template Schema

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  variables: [
    {
      key: String,
      placeholder: String,
      type: String
    }
  ],
  createdAt: Date
}
```

### 2.5 Snippet Schema

```javascript
{
  _id: ObjectId,
  userId: String (Better Auth user ID),
  title: String,
  category: String,
  language: String,
  code: String,
  requiredEnv: [String],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Tasks

### 2.1 Create Model Files

- [ ] ~~User model~~ (Better Auth handles this automatically)
- [ ] Project model with relationships
- [ ] EnvVariable model with encryption support
- [ ] Template model
- [ ] Snippet model
- [ ] UserSettings model (optional for custom preferences)

### 2.2 Setup Mongoose Connection

- [ ] Create `src/lib/mongodb.ts` with connection logic
- [ ] Add environment variables: `MONGODB_URI`
- [ ] Implement connection pooling
- [ ] Test connection with Better Auth

### 2.3 Implement Encryption Layer

- [ ] Create `src/utils/encryption.ts` for AES-256 encryption
- [ ] Add encrypt/decrypt functions for env variable values
- [ ] Use crypto-js for secure storage

## Files to Create

- `src/models/User.ts`
- `src/models/Project.ts`
- `src/models/EnvVariable.ts`
- `src/models/Template.ts`
- `src/models/Snippet.ts`
- `src/lib/mongodb.ts`
- `src/utils/encryption.ts`

## Success Criteria

- ✅ All schemas defined and tested
- ✅ MongoDB connection established
- ✅ Encryption/decryption working
- ✅ Models export correctly

## Time Estimate: 1-1.5 hours
