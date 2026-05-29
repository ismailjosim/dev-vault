import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { Snippet } from '@/models/Snippet'
import { snippetCreateSchema, snippetQuerySchema } from '@/types/snippet'
import { getBuiltInSnippets } from '@/utils/snippets'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()

		const query = snippetQuerySchema.parse(
			Object.fromEntries(request.nextUrl.searchParams),
		)
		const filter: Record<string, unknown> = { userId }

		if (query.search) {
			filter.$or = [
				{ title: { $regex: query.search, $options: 'i' } },
				{ description: { $regex: query.search, $options: 'i' } },
				{ tags: { $regex: query.search, $options: 'i' } },
			]
		}

		if (query.category) filter.category = query.category
		if (query.language) filter.language = query.language
		if (query.tag) filter.tags = query.tag

		const customSnippets = await Snippet.find(filter).sort({ createdAt: -1 })
		const builtIns = getBuiltInSnippets().filter((snippet) => {
			const searchText = [
				snippet.title,
				snippet.description,
				snippet.category,
				snippet.language,
				...snippet.tags,
				...snippet.requiredEnv,
			]
				.join(' ')
				.toLowerCase()

			return (
				(!query.search || searchText.includes(query.search.toLowerCase())) &&
				(!query.category || snippet.category === query.category) &&
				(!query.language || snippet.language === query.language) &&
				(!query.tag || snippet.tags.includes(query.tag))
			)
		})

		return NextResponse.json({
			snippets: [
				...builtIns.map((snippet) => ({
					...snippet,
					_id: snippet.id,
					createdAt: null,
					updatedAt: null,
					starCount: 0,
				})),
				...serializeDocument<Record<string, unknown>[]>(customSnippets),
			],
		})
	} catch (error) {
		return handleApiError(error)
	}
}

export async function POST(request: NextRequest) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()

		const input = snippetCreateSchema.parse(await request.json())
		const snippet = await Snippet.create({
			...input,
			userId,
		})

		return NextResponse.json(
			{ snippet: serializeDocument(snippet) },
			{ status: 201 },
		)
	} catch (error) {
		return handleApiError(error)
	}
}
