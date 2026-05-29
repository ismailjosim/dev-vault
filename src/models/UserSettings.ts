import mongoose, { Schema, Document } from 'mongoose'

export interface IUserSettings extends Document {
	betterAuthUserId: string
	email: string
	theme: 'light' | 'dark' | 'system'
	autoLockTimeout: number
	defaultExportFormat: string
	defaultCopyFormat: string
	clipboardClearTimeout: number
	emailNotifications: {
		expiringCredentials: boolean
		loginAlerts: boolean
	}
	createdAt: Date
	updatedAt: Date
}

const userSettingsSchema = new Schema<IUserSettings>(
	{
		betterAuthUserId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		theme: {
			type: String,
			enum: ['light', 'dark', 'system'],
			default: 'system',
		},
		autoLockTimeout: {
			type: Number,
			default: 15, // 15 minutes
		},
		defaultExportFormat: {
			type: String,
			default: 'json',
		},
		defaultCopyFormat: {
			type: String,
			default: 'key=value',
		},
		clipboardClearTimeout: {
			type: Number,
			default: 30, // 30 seconds
		},
		emailNotifications: {
			expiringCredentials: {
				type: Boolean,
				default: true,
			},
			loginAlerts: {
				type: Boolean,
				default: true,
			},
		},
	},
	{
		timestamps: true,
	},
)

export const UserSettings =
	mongoose.models.UserSettings ||
	mongoose.model<IUserSettings>('UserSettings', userSettingsSchema)
