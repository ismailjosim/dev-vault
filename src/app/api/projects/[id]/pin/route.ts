import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type RouteContext = {
	params: Promise<{ id: string }>
}

const pinProjectSchema = z.object({
	isPinned: z.boolean(),
})

export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id } = await context.params
		const input = pinProjectSchema.parse(await request.json())
		const project = await Project.findOneAndUpdate(
			{ _id: id, userId },
			{ isPinned: input.isPinned },
			{ new: true, runValidators: true },
		)

		if (!project) {
			return NextResponse.json(
				{ message: 'Project not found' },
				{ status: 404 },
			)
		}

		return NextResponse.json({ project: serializeDocument(project) })
	} catch (error) {
		return handleApiError(error)
	}
}
