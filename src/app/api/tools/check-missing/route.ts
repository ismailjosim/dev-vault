import { compareEnvFiles, generateComparisonReport } from '@/utils/env-checker'
import { parseEnvText } from '@/utils/env-parser'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const checkMissingSchema = z.object({
	projectName: z.string().trim().optional().default('Project'),
	exampleContent: z.string(),
	projectContent: z.string(),
})

export async function POST(request: NextRequest) {
	const input = checkMissingSchema.parse(await request.json())
	const comparison = compareEnvFiles(
		parseEnvText(input.exampleContent).variables,
		parseEnvText(input.projectContent).variables,
	)

	return NextResponse.json({
		comparison,
		report: generateComparisonReport(input.projectName, comparison),
	})
}
