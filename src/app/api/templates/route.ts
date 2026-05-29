import { getBuiltInTemplates } from '@/utils/templates'
import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({ templates: getBuiltInTemplates() })
}
