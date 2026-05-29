import { FilterPanel } from '@/components/common/FilterPanel'
import { SearchBar } from '@/components/common/SearchBar'
import { ProjectList } from '@/components/projects/ProjectList'
import { ProjectSummary } from '@/components/projects/ProjectCard'
import { getCurrentUser } from '@/lib/session'
import { connectDB } from '@/lib/mongodb'
import { serializeDocument } from '@/lib/api'
import { Project } from '@/models/Project'
import { projectQuerySchema } from '@/types/project'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type DashboardPageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DashboardPage({
	searchParams,
}: DashboardPageProps) {
	const user = await getCurrentUser()
	if (!user?.id) redirect('/auth/login')

	await connectDB()
	const rawParams = await searchParams
	const query = projectQuerySchema.parse({
		search: rawParams.search,
		category: rawParams.category,
		framework: rawParams.framework,
		tag: rawParams.tag,
		page: rawParams.page,
		limit: rawParams.limit,
	})
	const filter: Record<string, unknown> = { userId: user.id }

	if (query.search) {
		filter.$or = [
			{ projectName: { $regex: query.search, $options: 'i' } },
			{ description: { $regex: query.search, $options: 'i' } },
		]
	}

	if (query.category) filter.category = query.category
	if (query.framework) filter.framework = query.framework
	if (query.tag) filter.tags = query.tag

	const projects = await Project.find(filter)
		.sort({ isPinned: -1, createdAt: -1 })
		.limit(query.limit)

	return (
		<main className='min-h-screen bg-zinc-50 px-6 py-8'>
			<div className='mx-auto max-w-6xl'>
				<div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
					<div>
						<h1 className='text-2xl font-semibold text-zinc-950'>Projects</h1>
						<p className='mt-1 text-sm text-zinc-600'>
							Manage project credentials and environment files.
						</p>
					</div>
					<Link
						href='/dashboard/projects/create'
						className='rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white'
					>
						New project
					</Link>
				</div>

				<div className='mt-6 grid gap-3 lg:grid-cols-[1fr_360px]'>
					<SearchBar />
					<FilterPanel />
				</div>

				<div className='mt-6'>
					<ProjectList
						projects={serializeDocument<ProjectSummary[]>(projects)}
					/>
				</div>
			</div>
		</main>
	)
}
