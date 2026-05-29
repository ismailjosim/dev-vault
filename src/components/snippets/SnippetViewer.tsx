'use client'

import { Copy, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export type SnippetDetail = {
	_id: string
	title: string
	category: string
	language: string
	code: string
	description: string
	requiredEnv: string[]
	tags: string[]
	isBuiltIn?: boolean
	updatedAt?: string | null
}

export function SnippetViewer({ snippet }: { snippet: SnippetDetail }) {
	const router = useRouter()
	const [copied, setCopied] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	async function copyCode() {
		await navigator.clipboard.writeText(snippet.code)
		setCopied(true)
		window.setTimeout(() => setCopied(false), 1500)
	}

	async function deleteSnippet() {
		if (!window.confirm('Delete this snippet?')) return

		setIsDeleting(true)
		const response = await fetch(`/api/snippets/${snippet._id}`, {
			method: 'DELETE',
		})
		setIsDeleting(false)

		if (response.ok) {
			router.push('/dashboard/snippets')
			router.refresh()
		}
	}

	return (
		<div className='space-y-6'>
			<section className='border-border bg-card rounded-lg border p-5'>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
					<div>
						<h1 className='text-foreground text-2xl font-semibold'>
							{snippet.title}
						</h1>
						<p className='text-muted-foreground mt-1 max-w-2xl text-sm'>
							{snippet.description || 'No description'}
						</p>
					</div>
					<div className='flex gap-2'>
						<button
							type='button'
							onClick={copyCode}
							className='border-border text-foreground hover:bg-hover inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
						>
							<Copy className='h-4 w-4' />
							{copied ? 'Copied' : 'Copy'}
						</button>
						{!snippet.isBuiltIn && (
							<button
								type='button'
								onClick={deleteSnippet}
								disabled={isDeleting}
								className='border-danger/30 text-danger hover:bg-danger-foreground inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm disabled:opacity-60'
							>
								<Trash2 className='h-4 w-4' />
								Delete
							</button>
						)}
					</div>
				</div>

				<div className='mt-4 flex flex-wrap gap-2'>
					<span className='rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800'>
						{snippet.category}
					</span>
					<span className='rounded bg-sky-100 px-2 py-1 text-xs text-sky-800'>
						{snippet.language}
					</span>
					{snippet.tags.map((tag) => (
						<span
							key={tag}
							className='bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs'
						>
							{tag}
						</span>
					))}
				</div>
			</section>

			{snippet.requiredEnv.length > 0 && (
				<section className='border-border bg-card rounded-lg border p-5'>
					<h2 className='text-card-foreground text-sm font-medium'>
						Required environment variables
					</h2>
					<div className='mt-3 flex flex-wrap gap-2'>
						{snippet.requiredEnv.map((key) => (
							<span
								key={key}
								className='bg-secondary text-secondary-foreground rounded px-2 py-1 font-mono text-xs'
							>
								{key}
							</span>
						))}
					</div>
				</section>
			)}

			<div className='border-border bg-card overflow-hidden rounded-lg border'>
				<SyntaxHighlighter
					language={snippet.language}
					style={oneDark}
					customStyle={{
						margin: 0,
						borderRadius: 0,
						background: 'transparent',
						fontSize: '13px',
					}}
					codeTagProps={{ style: { fontFamily: 'var(--font-geist-mono)' } }}
				>
					{snippet.code}
				</SyntaxHighlighter>
			</div>
		</div>
	)
}
