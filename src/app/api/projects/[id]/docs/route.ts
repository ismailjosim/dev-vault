import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { projectDocumentationSchema } from '@/types/project'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id } = await context.params
		const documentation = projectDocumentationSchema.parse(await request.json())
		const project = await Project.findOneAndUpdate(
			{ _id: id, userId },
			{ documentation },
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
