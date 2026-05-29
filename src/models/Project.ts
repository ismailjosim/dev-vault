import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IProject extends Document {
	userId: string
	projectName: string
	slug: string
	description: string
	category: string
	framework: string
	tags: string[]
	isPinned: boolean
	envVariables: Types.ObjectId[]
	environments: string[]
	createdAt: Date
	updatedAt: Date
}

const projectSchema = new Schema<IProject>(
	{
		userId: {
			type: String,
			required: true,
			index: true,
		},
		projectName: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			index: true,
		},
		description: {
			type: String,
			default: '',
		},
		category: {
			type: String,
			enum: ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'Other'],
			default: 'Other',
		},
		framework: {
			type: String,
			default: 'Other',
		},
		tags: {
			type: [String],
			default: [],
		},
		isPinned: {
			type: Boolean,
			default: false,
		},
		envVariables: [
			{
				type: Schema.Types.ObjectId,
				ref: 'EnvVariable',
			},
		],
		environments: {
			type: [String],
			enum: ['development', 'staging', 'production', 'test'],
			default: ['development', 'production'],
		},
	},
	{
		timestamps: true,
	},
)

// Index for user projects
projectSchema.index({ userId: 1, createdAt: -1 })

export const Project =
	mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema)
