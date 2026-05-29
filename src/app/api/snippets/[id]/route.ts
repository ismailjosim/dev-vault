import { handleApiError, requireUserId, serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { Snippet } from '@/models/Snippet'
import { snippetUpdateSchema } from '@/types/snippet'
import { getBuiltInSnippet } from '@/utils/snippets'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		const { id } = await context.params
		const builtInSnippet = getBuiltInSnippet(id)

		if (builtInSnippet) {
			return NextResponse.json({
				snippet: {
					...builtInSnippet,
					_id: builtInSnippet.id,
					createdAt: null,
					updatedAt: null,
					starCount: 0,
				},
			})
		}

		await connectDB()
		const snippet = await Snippet.findOne({ _id: id, userId })

		if (!snippet) {
			return NextResponse.json(
				{ message: 'Snippet not found' },
				{ status: 404 },
			)
		}

		return NextResponse.json({ snippet: serializeDocument(snippet) })
	} catch (error) {
		return handleApiError(error)
	}
}

export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id } = await context.params
		const input = snippetUpdateSchema.parse(await request.json())
		const snippet = await Snippet.findOneAndUpdate({ _id: id, userId }, input, {
			new: true,
			runValidators: true,
		})

		if (!snippet) {
			return NextResponse.json(
				{ message: 'Snippet not found' },
				{ status: 404 },
			)
		}

		return NextResponse.json({ snippet: serializeDocument(snippet) })
	} catch (error) {
		return handleApiError(error)
	}
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
	try {
		const { userId, response } = await requireUserId()
		if (response) return response

		await connectDB()
		const { id } = await context.params
		const snippet = await Snippet.findOneAndDelete({ _id: id, userId })

		if (!snippet) {
			return NextResponse.json(
				{ message: 'Snippet not found' },
				{ status: 404 },
			)
		}

		return NextResponse.json({ message: 'Snippet deleted' })
	} catch (error) {
		return handleApiError(error)
	}
}
