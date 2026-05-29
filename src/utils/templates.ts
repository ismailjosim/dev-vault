export type TemplateVariable = {
	key: string
	placeholder: string
	type: 'secret' | 'jwt' | 'api_key' | 'url' | 'database_url' | 'other'
}

export type BuiltInTemplate = {
	id: string
	name: string
	description: string
	variables: TemplateVariable[]
}

export const builtInTemplates: BuiltInTemplate[] = [
	{
		id: 'next-mongodb-better-auth',
		name: 'Next.js + MongoDB + Better Auth',
		description: 'Auth-ready Next.js app with MongoDB storage and OAuth slots.',
		variables: [
			{ key: 'MONGODB_URI', placeholder: '', type: 'database_url' },
			{ key: 'BETTER_AUTH_SECRET', placeholder: '', type: 'jwt' },
			{ key: 'BETTER_AUTH_URL', placeholder: '', type: 'url' },
			{ key: 'GOOGLE_CLIENT_ID', placeholder: '', type: 'api_key' },
			{ key: 'GOOGLE_CLIENT_SECRET', placeholder: '', type: 'secret' },
		],
	},
	{
		id: 'mern-stack',
		name: 'MERN Stack',
		description: 'Express API, MongoDB, JWT secrets, and client URL.',
		variables: [
			{ key: 'PORT', placeholder: '5000', type: 'other' },
			{ key: 'MONGODB_URI', placeholder: '', type: 'database_url' },
			{ key: 'JWT_ACCESS_SECRET', placeholder: '', type: 'jwt' },
			{ key: 'JWT_REFRESH_SECRET', placeholder: '', type: 'jwt' },
			{ key: 'CLIENT_URL', placeholder: '', type: 'url' },
		],
	},
	{
		id: 'cloudinary',
		name: 'Cloudinary Integration',
		description: 'Image upload and media delivery credentials.',
		variables: [
			{ key: 'CLOUDINARY_CLOUD_NAME', placeholder: '', type: 'other' },
			{ key: 'CLOUDINARY_API_KEY', placeholder: '', type: 'api_key' },
			{ key: 'CLOUDINARY_API_SECRET', placeholder: '', type: 'secret' },
		],
	},
	{
		id: 'stripe',
		name: 'Stripe',
		description: 'Payments, webhooks, and public publishable key.',
		variables: [
			{ key: 'STRIPE_SECRET_KEY', placeholder: '', type: 'secret' },
			{ key: 'STRIPE_WEBHOOK_SECRET', placeholder: '', type: 'secret' },
			{ key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', placeholder: '', type: 'api_key' },
		],
	},
	{
		id: 'firebase',
		name: 'Firebase',
		description: 'Firebase web app configuration for Next.js or React.',
		variables: [
			{ key: 'NEXT_PUBLIC_FIREBASE_API_KEY', placeholder: '', type: 'api_key' },
			{ key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', placeholder: '', type: 'url' },
			{ key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', placeholder: '', type: 'other' },
			{ key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', placeholder: '', type: 'other' },
			{ key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', placeholder: '', type: 'other' },
			{ key: 'NEXT_PUBLIC_FIREBASE_APP_ID', placeholder: '', type: 'other' },
		],
	},
	{
		id: 'aws',
		name: 'AWS Integration',
		description: 'S3-compatible access keys, region, and bucket name.',
		variables: [
			{ key: 'AWS_ACCESS_KEY_ID', placeholder: '', type: 'api_key' },
			{ key: 'AWS_SECRET_ACCESS_KEY', placeholder: '', type: 'secret' },
			{ key: 'AWS_REGION', placeholder: 'us-east-1', type: 'other' },
			{ key: 'AWS_BUCKET_NAME', placeholder: '', type: 'other' },
		],
	},
	{
		id: 'github-oauth',
		name: 'GitHub OAuth',
		description: 'GitHub OAuth app client credentials and callback URL.',
		variables: [
			{ key: 'GITHUB_CLIENT_ID', placeholder: '', type: 'api_key' },
			{ key: 'GITHUB_CLIENT_SECRET', placeholder: '', type: 'secret' },
			{ key: 'GITHUB_CALLBACK_URL', placeholder: '', type: 'url' },
		],
	},
	{
		id: 'supabase',
		name: 'Supabase',
		description: 'Supabase URL, anon key, and server-only service role.',
		variables: [
			{ key: 'NEXT_PUBLIC_SUPABASE_URL', placeholder: '', type: 'url' },
			{ key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', placeholder: '', type: 'api_key' },
			{ key: 'SUPABASE_SERVICE_ROLE_KEY', placeholder: '', type: 'secret' },
		],
	},
]

export function getBuiltInTemplates() {
	return builtInTemplates
}

export function getBuiltInTemplate(templateId: string) {
	return builtInTemplates.find((template) => template.id === templateId) || null
}
