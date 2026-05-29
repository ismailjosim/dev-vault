import mongoose, { Schema, Document } from 'mongoose'

interface TemplateVariable {
	key: string
	placeholder: string
	type: string
}

export interface ITemplate extends Document {
	name: string
	description: string
	variables: TemplateVariable[]
	createdAt: Date
	updatedAt: Date
}

const templateSchema = new Schema<ITemplate>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
		description: {
			type: String,
			default: '',
		},
		variables: [
			{
				key: {
					type: String,
					required: true,
				},
				placeholder: {
					type: String,
					required: true,
				},
				type: {
					type: String,
					enum: [
						'secret',
						'jwt',
						'api_key',
						'url',
						'database_url',
						'string',
						'number',
						'boolean',
						'other',
					],
					default: 'string',
				},
			},
		],
	},
	{
		timestamps: true,
	},
)

export const Template =
	mongoose.models.Template ||
	mongoose.model<ITemplate>('Template', templateSchema)
