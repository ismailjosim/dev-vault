import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { projectCreateSchema, projectQuerySchema } from '@/types/project'
import { slugify } from '@/utils/slug'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()

		const query = projectQuerySchema.parse(
			Object.fromEntries(request.nextUrl.searchParams),
		)
		const filter: Record<string, unknown> = { userId }

		if (query.search) {
			filter.$or = [
				{ projectName: { $regex: query.search, $options: 'i' } },
				{ description: { $regex: query.search, $options: 'i' } },
			]
		}

		if (query.category) filter.category = query.category
		if (query.framework) filter.framework = query.framework
		if (query.tag) filter.tags = query.tag

		const skip = (query.page - 1) * query.limit
		const [projects, total] = await Promise.all([
			Project.find(filter)
				.sort({ isPinned: -1, createdAt: -1 })
				.skip(skip)
				.limit(query.limit),
			Project.countDocuments(filter),
		])

		return NextResponse.json({
			projects: serializeDocument(projects),
			pagination: {
				page: query.page,
				limit: query.limit,
				total,
				totalPages: Math.ceil(total / query.limit),
			},
		})
	} catch (error) {
		return handleApiError(error)
	}
}

export async function POST(request: NextRequest) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()

		const input = projectCreateSchema.parse(await request.json())
		const baseSlug = slugify(input.projectName)
		let slug = baseSlug
		let suffix = 1

		while (await Project.exists({ userId, slug })) {
			suffix += 1
			slug = `${baseSlug}-${suffix}`
		}

		const project = await Project.create({
			...input,
			userId,
			slug,
		})

		return NextResponse.json(
			{ project: serializeDocument(project) },
			{ status: 201 },
		)
	} catch (error) {
		return handleApiError(error)
	}
}
