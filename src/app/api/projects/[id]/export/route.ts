import { handleApiError, requireUserId } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { EnvVariable } from '@/models/EnvVariable'
import { Project } from '@/models/Project'
import { exportSchema } from '@/types/project'
import { generateEnvFile, getExportFilename } from '@/utils/env-exporter'
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

		const variables = await EnvVariable.find(filter).sort({
			environment: 1,
			key: 1,
		})
		const exportVariables = variables.map((variable) => ({
			key: variable.key,
			value: variable.getDecryptedValue(),
			note: variable.note,
			type: variable.type,
			environment: variable.environment,
		}))
		const filename = getExportFilename(project.slug, input.format)
		const content = generateEnvFile(exportVariables, input.format)

		return NextResponse.json({ filename, content })
	} catch (error) {
		return handleApiError(error)
	}
}
