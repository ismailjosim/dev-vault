import { getBuiltInTemplate } from '@/utils/templates'
import { NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
	const { id } = await context.params
	const template = getBuiltInTemplate(id)

	if (!template) {
		return NextResponse.json({ message: 'Template not found' }, { status: 404 })
	}

	return NextResponse.json({ template })
}
