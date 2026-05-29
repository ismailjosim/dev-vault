import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { EnvVariable } from '@/models/EnvVariable'
import { Project } from '@/models/Project'
import { envVariableImportSchema } from '@/types/project'
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

		const input = envVariableImportSchema.parse(await request.json())
		const savedVariables = []

		for (const variableInput of input.variables) {
			const existingVariable = await EnvVariable.findOne({
				projectId: project._id,
				key: variableInput.key,
				environment: variableInput.environment,
			})

			if (existingVariable) {
				existingVariable.set(variableInput)
				savedVariables.push(await existingVariable.save())
				continue
			}

			const variable = await EnvVariable.create({
				...variableInput,
				projectId: project._id,
			})
			project.envVariables.addToSet(variable._id)
			savedVariables.push(variable)
		}

		await project.save()

		const variables =
			serializeDocument<Record<string, unknown>[]>(savedVariables)

		return NextResponse.json({
			variables: variables.map((variable) => ({
				...variable,
				value: null,
			})),
			count: savedVariables.length,
		})
	} catch (error) {
		return handleApiError(error)
	}
}
