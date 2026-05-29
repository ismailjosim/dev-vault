import { SnippetCreateInput } from '@/types/snippet'

export type BuiltInSnippet = SnippetCreateInput & {
	id: string
	isBuiltIn: true
}

export const builtInSnippets: BuiltInSnippet[] = [
	{
		id: 'cloudinary-node-setup',
		title: 'Cloudinary Node.js Setup',
		category: 'Cloudinary',
		language: 'javascript',
		description: 'Configure Cloudinary v2 with environment variables.',
		requiredEnv: [
			'CLOUDINARY_CLOUD_NAME',
			'CLOUDINARY_API_KEY',
			'CLOUDINARY_API_SECRET',
		],
		tags: ['uploads', 'media'],
		isPublic: true,
		isBuiltIn: true,
		code: `import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;`,
	},
	{
		id: 'mongodb-mongoose-connection',
		title: 'MongoDB Mongoose Connection',
		category: 'MongoDB',
		language: 'typescript',
		description: 'Reusable Mongoose connection helper for server apps.',
		requiredEnv: ['MONGODB_URI'],
		tags: ['database', 'mongoose'],
		isPublic: true,
		isBuiltIn: true,
		code: `import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}`,
	},
	{
		id: 'better-auth-next-config',
		title: 'Better Auth Configuration',
		category: 'Better Auth',
		language: 'typescript',
		description: 'Minimal Better Auth setup for a Next.js app.',
		requiredEnv: ['MONGODB_URI', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL'],
		tags: ['auth', 'nextjs'],
		isPublic: true,
		isBuiltIn: true,
		code: `import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(process.env.MONGODB_URI!),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});`,
	},
	{
		id: 'stripe-webhook-setup',
		title: 'Stripe Setup with Webhook',
		category: 'Stripe',
		language: 'typescript',
		description: 'Stripe client and webhook endpoint secret setup.',
		requiredEnv: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
		tags: ['payments', 'webhooks'],
		isPublic: true,
		isBuiltIn: true,
		code: `import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-01-01',
});

export const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;`,
	},
	{
		id: 'firebase-app-init',
		title: 'Firebase App Initialization',
		category: 'Firebase',
		language: 'javascript',
		description: 'Initialize Firebase Auth and Firestore in a frontend app.',
		requiredEnv: [
			'NEXT_PUBLIC_FIREBASE_API_KEY',
			'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
			'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
			'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
			'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
			'NEXT_PUBLIC_FIREBASE_APP_ID',
		],
		tags: ['firebase', 'react'],
		isPublic: true,
		isBuiltIn: true,
		code: `import { initializeApp } from "firebase/app";
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
export const db = getFirestore(app);`,
	},
	{
		id: 'axios-interceptor-instance',
		title: 'Axios Interceptor Setup',
		category: 'Axios',
		language: 'javascript',
		description: 'Axios instance with bearer token injection.',
		requiredEnv: ['NEXT_PUBLIC_API_URL'],
		tags: ['api', 'frontend'],
		isPublic: true,
		isBuiltIn: true,
		code: `import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});`,
	},
	{
		id: 'aws-s3-upload',
		title: 'AWS S3 File Upload',
		category: 'AWS',
		language: 'javascript',
		description: 'Upload a file object to S3 with the AWS SDK.',
		requiredEnv: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'],
		tags: ['storage', 'uploads'],
		isPublic: true,
		isBuiltIn: true,
		code: `import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3(file, bucketName) {
  return s3.upload({
    Bucket: bucketName,
    Key: file.name,
    Body: file,
  }).promise();
}`,
	},
	{
		id: 'jwt-verification-middleware',
		title: 'JWT Token Verification Middleware',
		category: 'JWT',
		language: 'javascript',
		description: 'Small JWT verification helper for API middleware.',
		requiredEnv: ['JWT_ACCESS_SECRET'],
		tags: ['auth', 'middleware'],
		isPublic: true,
		isBuiltIn: true,
		code: `import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    throw new Error('Invalid token');
  }
}`,
	},
]

export function getBuiltInSnippets() {
	return builtInSnippets
}

export function getBuiltInSnippet(id: string) {
	return builtInSnippets.find((snippet) => snippet.id === id) || null
}
