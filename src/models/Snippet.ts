import mongoose, { Schema, Document } from 'mongoose'

export interface ISnippet extends Document {
	userId: string
	title: string
	category: string
	language: string
	code: string
	requiredEnv: string[]
	tags: string[]
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
		requiredEnv: {
			type: [String],
			default: [],
		},
		tags: {
			type: [String],
			default: [],
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

export const Snippet =
	mongoose.models.Snippet || mongoose.model<ISnippet>('Snippet', snippetSchema)
