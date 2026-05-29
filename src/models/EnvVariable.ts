import mongoose, { Schema, Document, Types } from 'mongoose'
import { encryptValue, decryptValue } from '@/utils/encryption'

export interface IEnvVariable extends Document {
	projectId: Types.ObjectId
	key: string
	value: string
	type: string
	isPublic: boolean
	note: string
	environment: string
	expiryDate?: Date
	createdAt: Date
	updatedAt: Date
	// Methods
	getDecryptedValue(): string
}

const envVariableSchema = new Schema<IEnvVariable>(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: true,
			index: true,
		},
		key: {
			type: String,
			required: true,
			trim: true,
		},
		value: {
			type: String,
			required: true,
			set: (value: string) => {
				// Encrypt on save
				return encryptValue(value)
			},
		},
		type: {
			type: String,
			enum: ['secret', 'jwt', 'api_key', 'url', 'database_url', 'other'],
			default: 'other',
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
		note: {
			type: String,
			default: '',
		},
		environment: {
			type: String,
			enum: ['dev', 'prod', 'staging', 'test'],
			required: true,
		},
		expiryDate: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	},
)

// Index for efficient querying
envVariableSchema.index({ projectId: 1, environment: 1 })
envVariableSchema.index(
	{ projectId: 1, key: 1, environment: 1 },
	{ unique: true },
)

// Method to get decrypted value
envVariableSchema.methods.getDecryptedValue = function (): string {
	return decryptValue(this.value)
}

export const EnvVariable =
	mongoose.models.EnvVariable ||
	mongoose.model<IEnvVariable>('EnvVariable', envVariableSchema)
