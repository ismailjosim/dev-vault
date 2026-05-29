# Step 2: Database Schema & Models

## Objective

Design and implement MongoDB schemas for projects, environment variables, and related data structures.

## Database Models

### 2.1 User Schema

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 Project Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
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
  value: String (encrypted),
  type: String (secret, jwt, api_key, url, other),
  isPublic: Boolean,
  note: String,
  environment: String,
  expiryDate: Date,
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
  userId: ObjectId (ref: User),
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

- [ ] User model with password hashing
- [ ] Project model with relationships
- [ ] EnvVariable model with encryption support
- [ ] Template model
- [ ] Snippet model

### 2.2 Setup Mongoose Connection

- [ ] Create `lib/mongodb.ts` with connection logic
- [ ] Add environment variables: `MONGODB_URI`
- [ ] Implement connection pooling

### 2.3 Implement Encryption Layer

- [ ] Create `utils/encryption.ts` for AES encryption
- [ ] Add encrypt/decrypt functions
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
