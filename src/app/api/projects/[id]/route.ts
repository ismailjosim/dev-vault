import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { EnvVariable } from '@/models/EnvVariable'
import { Project } from '@/models/Project'
import { projectUpdateSchema } from '@/types/project'
import { slugify } from '@/utils/slug'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id } = await context.params
		const project = await Project.findOne({ _id: id, userId })

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

export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id } = await context.params
		const input = projectUpdateSchema.parse(await request.json())
		const update: Record<string, unknown> = { ...input }

		if (input.projectName) {
			update.slug = slugify(input.projectName)
		}

		const project = await Project.findOneAndUpdate(
			{ _id: id, userId },
			update,
			{
				new: true,
				runValidators: true,
			},
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

export async function DELETE(_request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id } = await context.params
		const project = await Project.findOneAndDelete({ _id: id, userId })

		if (!project) {
			return NextResponse.json(
				{ message: 'Project not found' },
				{ status: 404 },
			)
		}

		await EnvVariable.deleteMany({ projectId: project._id })

		return NextResponse.json({ message: 'Project deleted' })
	} catch (error) {
		return handleApiError(error)
	}
}
