import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { EnvVariable } from '@/models/EnvVariable'
import { Project } from '@/models/Project'
import { getBuiltInTemplate } from '@/utils/templates'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type RouteContext = {
	params: Promise<{ id: string; templateId: string }>
}

const applyTemplateSchema = z.object({
	environment: z.enum(['dev', 'prod', 'staging', 'test']).default('dev'),
})

export async function POST(request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id, templateId } = await context.params
		const template = getBuiltInTemplate(templateId)

		if (!template) {
			return NextResponse.json(
				{ message: 'Template not found' },
				{ status: 404 },
			)
		}

		const input = applyTemplateSchema.parse(await request.json())
		const project = await Project.findOne({ _id: id, userId })

		if (!project) {
			return NextResponse.json(
				{ message: 'Project not found' },
				{ status: 404 },
			)
		}

		const savedVariables = []

		for (const variable of template.variables) {
			const existingVariable = await EnvVariable.findOne({
				projectId: project._id,
				key: variable.key,
				environment: input.environment,
			})

			if (existingVariable) continue

			const savedVariable = await EnvVariable.create({
				projectId: project._id,
				key: variable.key,
				value: variable.placeholder || ' ',
				type: variable.type,
				isPublic: variable.key.startsWith('NEXT_PUBLIC_'),
				note: `Added from ${template.name}`,
				environment: input.environment,
			})

			project.envVariables.addToSet(savedVariable._id)
			savedVariables.push(savedVariable)
		}

		await project.save()

		return NextResponse.json({
			count: savedVariables.length,
			variables: serializeDocument<Record<string, unknown>[]>(
				savedVariables,
			).map((variable) => ({ ...variable, value: null })),
		})
	} catch (error) {
		return handleApiError(error)
	}
}
