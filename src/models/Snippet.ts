import mongoose, { Schema, Document } from 'mongoose'

export interface ISnippet extends Document {
	userId: string
	title: string
	category: string
	language: string
	code: string
	description: string
	requiredEnv: string[]
	tags: string[]
	starCount: number
	isPublic: boolean
	isBuiltIn: boolean
	createdAt: Date
	updatedAt: Date
}

const snippetSchema = new Schema<ISnippet>(
	{
		userId: {
			type: String,
			required: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			index: true,
		},
		language: {
			type: String,
			required: true,
			enum: [
				'javascript',
				'typescript',
				'python',
				'bash',
				'sql',
				'json',
				'yaml',
				'dockerfile',
				'other',
			],
			default: 'javascript',
		},
		code: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: '',
		},
		requiredEnv: {
			type: [String],
			default: [],
		},
		tags: {
			type: [String],
			default: [],
			index: true,
		},
		starCount: {
			type: Number,
			default: 0,
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
		isBuiltIn: {
			type: Boolean,
			default: false,
			index: true,
		},
	},
	{
		timestamps: true,
	},
)

// Index for efficient user snippet queries
snippetSchema.index({ userId: 1, createdAt: -1 })
snippetSchema.index({ userId: 1, category: 1 })
snippetSchema.index({ title: 'text', description: 'text', tags: 'text' })

export const Snippet =
	mongoose.models.Snippet || mongoose.model<ISnippet>('Snippet', snippetSchema)
