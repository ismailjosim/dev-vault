import mongoose, { Connection } from 'mongoose'

let cachedConnection: Connection | null = null

export async function connectDB(): Promise<Connection> {
	if (cachedConnection) {
		console.log('Using cached MongoDB connection')
		return cachedConnection
	}

	try {
		const mongodbUrl = process.env.MONGODB_URL

		if (!mongodbUrl) {
			throw new Error('MONGODB_URL environment variable is not defined')
		}

		console.log('Creating new MongoDB connection...')

		await mongoose.connect(mongodbUrl, {
			maxPoolSize: 10,
			minPoolSize: 2,
		})

		cachedConnection = mongoose.connection

		cachedConnection.on('error', (err) => {
			console.error('MongoDB connection error:', err)
		})

		cachedConnection.on('disconnected', () => {
			console.warn('MongoDB disconnected')
		})

		console.log('MongoDB connected successfully')
		return cachedConnection
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error)
		throw error
	}
}

export async function disconnectDB(): Promise<void> {
	if (cachedConnection) {
		await mongoose.disconnect()
		cachedConnection = null
		console.log('MongoDB disconnected')
	}
}

export function getConnection(): Connection | null {
	return cachedConnection
}
