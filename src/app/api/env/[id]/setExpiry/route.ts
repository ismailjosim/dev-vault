import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { EnvVariable } from '@/models/EnvVariable'
import { Project } from '@/models/Project'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type RouteContext = {
	params: Promise<{ id: string }>
}

const setExpirySchema = z.object({
	expiryDate: z.string().datetime().nullable(),
})

export async function POST(request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id } = await context.params
		const input = setExpirySchema.parse(await request.json())
		const variable = await EnvVariable.findById(id)

		if (!variable) {
			return NextResponse.json(
				{ message: 'Environment variable not found' },
				{ status: 404 },
			)
		}

		const project = await Project.findOne({
			_id: variable.projectId,
			userId,
		})

		if (!project) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
		}

		variable.expiryDate = input.expiryDate ? new Date(input.expiryDate) : null
		await variable.save()

		const payload = serializeDocument<Record<string, unknown>>(variable)
		payload.value = null

		return NextResponse.json({ variable: payload })
	} catch (error) {
		return handleApiError(error)
	}
}
