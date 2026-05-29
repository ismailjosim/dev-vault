import { handleApiError, requireUserId } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const projects = await Project.find({ userId }).select('tags')
		const counts = new Map<string, number>()

		for (const project of projects) {
			for (const tag of project.tags) {
				counts.set(tag, (counts.get(tag) || 0) + 1)
			}
		}

		const tags = Array.from(counts.entries())
			.map(([tag, count]) => ({ tag, count }))
			.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))

		return NextResponse.json({ tags })
	} catch (error) {
		return handleApiError(error)
	}
}
