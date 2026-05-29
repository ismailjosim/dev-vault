import { validateEnvFile } from '@/utils/env-validator'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const validateEnvSchema = z.object({
	content: z.string(),
})

export async function POST(request: NextRequest) {
	const input = validateEnvSchema.parse(await request.json())
	return NextResponse.json(validateEnvFile(input.content))
}
