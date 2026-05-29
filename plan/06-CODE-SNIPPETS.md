# Step 6: Code Snippet Store

## Objective

Implement reusable code snippet storage system with categorization and search.

## 6.1 Snippet Data Structure

### Snippet Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  category: String,
  language: String (js, ts, jsx, tsx, python, etc),
  code: String,
  description: String,
  requiredEnv: [String],
  tags: [String],
  starCount: Number,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 6.2 Built-in Snippets

### Cloudinary Setup (Node.js)

```javascript
// Title: Cloudinary Node.js Setup
// Category: Cloudinary
// Required Env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### MongoDB Connection (Node.js)

```javascript
// Title: MongoDB Mongoose Connection
// Category: MongoDB
// Required Env: MONGODB_URI
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
```

### Better Auth Setup (Next.js)

```typescript
// Title: Better Auth Configuration
// Category: Better Auth
// Required Env: BETTER_AUTH_SECRET, BETTER_AUTH_URL
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(process.env.MONGODB_URI!),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
```

### Stripe Configuration (Node.js)

```javascript
// Title: Stripe Setup with Webhook
// Category: Stripe
// Required Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-01-01',
});

export const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
```

### Firebase Configuration (React)

```javascript
// Title: Firebase App Initialization
// Category: Firebase
// Required Env: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, etc
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Axios Instance (React)

```javascript
// Title: Axios Interceptor Setup
// Category: Axios
// Required Env: NEXT_PUBLIC_API_URL
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer \${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### AWS S3 Upload (Node.js)

```javascript
// Title: AWS S3 File Upload
// Category: AWS
// Required Env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: file.name,
    Body: file,
  };
  return s3.upload(params).promise();
};
```

### JWT Verification (Node.js)

```javascript
// Title: JWT Token Verification Middleware
// Category: JWT
// Required Env: JWT_ACCESS_SECRET
import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

## 6.3 Snippet Management Features

### Create Snippet

- [ ] Form with:
  - Title
  - Category dropdown
  - Language selector
  - Code editor (syntax highlighting)
  - Description
  - Required env variables (multi-select)
  - Tags
  - Public/Private toggle
- [ ] Code syntax highlighting with Prism
- [ ] Copy code button
- [ ] Save to database

### Browse Snippets

- [ ] Grid/list view of snippets
- [ ] Filter by category
- [ ] Filter by language
- [ ] Search by title/description
- [ ] Show required env vars
- [ ] Show tags
- [ ] Show usage count

### View Snippet

- [ ] Display code with syntax highlighting
- [ ] Copy full code
- [ ] Show required env variables
- [ ] Link to related project (if used)
- [ ] Edit button (if owner)
- [ ] Delete button (if owner)

### Edit Snippet

- [ ] Update title, category, code, etc
- [ ] Update required env vars
- [ ] Update tags

### Delete Snippet

- [ ] Confirm deletion
- [ ] Remove from database

### Snippet Metadata

- [ ] Show creation date
- [ ] Show last updated
- [ ] Star/favorite functionality
- [ ] Usage count

## 6.4 Code Editor Integration

### Dependencies

```bash
pnpm add react-syntax-highlighter prismjs
pnpm add -D @types/react-syntax-highlighter
pnpm add @monaco-editor/react (optional for better editor)
```

## Components

- `src/components/snippets/SnippetForm.tsx`
- `src/components/snippets/SnippetCard.tsx`
- `src/components/snippets/SnippetList.tsx`
- `src/components/snippets/SnippetViewer.tsx`
- `src/components/snippets/CodeEditor.tsx`
- `src/components/snippets/CategoryFilter.tsx`

## Pages

- `src/app/dashboard/snippets/page.tsx`
- `src/app/dashboard/snippets/create/page.tsx`
- `src/app/dashboard/snippets/[id]/page.tsx`

## API Routes

```
GET    /api/snippets
POST   /api/snippets
GET    /api/snippets/:id
PATCH  /api/snippets/:id
DELETE /api/snippets/:id
POST   /api/snippets/:id/star
GET    /api/snippets/search
```

## Success Criteria

- ✅ Can create/read/update/delete snippets
- ✅ Code syntax highlighting works
- ✅ Filter by category/language works
- ✅ Search functionality works
- ✅ Copy code button works
- ✅ Required env vars displayed correctly

## Time Estimate: 1.5-2 hours
