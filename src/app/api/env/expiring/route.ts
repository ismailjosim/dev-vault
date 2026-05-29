import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { EnvVariable } from '@/models/EnvVariable'
import { Project } from '@/models/Project'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const expiringQuerySchema = z.object({
	days: z.coerce.number().int().min(1).max(365).optional().default(7),
})

export async function GET(request: NextRequest) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const query = expiringQuerySchema.parse(
			Object.fromEntries(request.nextUrl.searchParams),
		)
		const projects = await Project.find({ userId }).select('_id projectName')
		const projectIds = projects.map((project) => project._id)
		const endDate = new Date()
		endDate.setDate(endDate.getDate() + query.days)

		const variables = await EnvVariable.find({
			projectId: { $in: projectIds },
			expiryDate: { $ne: null, $lte: endDate },
		}).sort({ expiryDate: 1 })
		const projectNames = new Map(
			projects.map((project) => [String(project._id), project.projectName]),
		)

		return NextResponse.json({
			variables: serializeDocument<Record<string, unknown>[]>(variables).map(
				(variable) => ({
					...variable,
					value: null,
					projectName: projectNames.get(String(variable.projectId)) || '',
				}),
			),
		})
	} catch (error) {
		return handleApiError(error)
	}
}
