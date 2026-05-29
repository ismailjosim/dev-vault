import { handleApiError, requireUserId } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { EnvVariable } from '@/models/EnvVariable'
import { Project } from '@/models/Project'
import { exportSchema } from '@/types/project'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
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

		const input = exportSchema.parse(await request.json())
		const filter: Record<string, unknown> = { projectId: project._id }

		if (input.environment) filter.environment = input.environment

		const variables = await EnvVariable.find(filter).sort({ key: 1 })

		if (input.format === 'json') {
			return NextResponse.json({
				filename: `${project.slug}.json`,
				content: JSON.stringify(
					Object.fromEntries(
						variables.map((variable) => [
							variable.key,
							variable.getDecryptedValue(),
						]),
					),
					null,
					2,
				),
			})
		}

		const filename =
			input.format === 'example' ? '.env.example' : `.${input.format}`
		const content = variables
			.map((variable) => {
				const value =
					input.format === 'example' ? '' : variable.getDecryptedValue()
				return `${variable.key}=${value}`
			})
			.join('\n')

		return NextResponse.json({ filename, content })
	} catch (error) {
		return handleApiError(error)
	}
}
