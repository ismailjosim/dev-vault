import { z } from 'zod'

export const snippetLanguageSchema = z.enum([
	'javascript',
	'typescript',
	'python',
	'bash',
	'sql',
	'json',
	'yaml',
	'dockerfile',
	'other',
])

const tagListSchema = z
	.array(z.string().trim().min(1).max(32))
	.max(12)
	.default([])

const envKeyListSchema = z
	.array(
		z
			.string()
			.trim()
			.min(1)
			.max(120)
			.regex(
				/^[A-Z][A-Z0-9_]*$/,
				'Use uppercase letters, numbers, and underscores',
			),
	)
	.max(24)
	.default([])

export const snippetCreateSchema = z.object({
	title: z.string().trim().min(2).max(100),
	category: z.string().trim().min(1).max(60),
	language: snippetLanguageSchema.default('javascript'),
	code: z.string().min(1).max(50000),
	description: z.string().trim().max(700).optional().default(''),
	requiredEnv: envKeyListSchema,
	tags: tagListSchema,
	isPublic: z.boolean().default(false),
})

export const snippetUpdateSchema = snippetCreateSchema
	.partial()
	.refine((value) => Object.keys(value).length > 0, {
		message: 'At least one field is required',
	})

export const snippetQuerySchema = z.object({
	search: z.string().trim().optional().default(''),
	category: z.string().trim().optional().default(''),
	language: snippetLanguageSchema.or(z.literal('')).optional().default(''),
	tag: z.string().trim().optional().default(''),
	page: z.coerce.number().int().min(1).optional().default(1),
	limit: z.coerce.number().int().min(1).max(50).optional().default(24),
})

export type SnippetCreateInput = z.infer<typeof snippetCreateSchema>
export type SnippetUpdateInput = z.infer<typeof snippetUpdateSchema>
