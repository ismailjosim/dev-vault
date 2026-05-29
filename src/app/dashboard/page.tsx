import { FilterPanel } from '@/components/common/FilterPanel'
import { SearchBar } from '@/components/common/SearchBar'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { ProjectList } from '@/components/projects/ProjectList'
import { ProjectSummary } from '@/components/projects/ProjectCard'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { getCurrentUser } from '@/lib/session'
import { connectDB } from '@/lib/mongodb'
import { serializeDocument } from '@/lib/api'
import { Project } from '@/models/Project'
import { projectQuerySchema } from '@/types/project'
import { KeyRound, LayoutTemplate, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

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
		<main className='min-h-screen bg-background px-6 py-8'>
			<div className='mx-auto max-w-6xl'>
				<div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
					<div>
						<h1 className='text-2xl font-semibold text-foreground'>Projects</h1>
						<p className='mt-1 text-sm text-muted-foreground'>
							Manage project credentials and environment files.
						</p>
					</div>
					<div className='flex items-center gap-3'>
						<ThemeToggle />
						<LogoutButton />
						<Link
							href='/dashboard/projects/create'
							className='rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90'
						>
							New project
						</Link>
					</div>
				</div>

				<div className='mt-6 grid gap-3 lg:grid-cols-[1fr_360px]'>
					<SearchBar />
					<FilterPanel />
				</div>

				<div className='mt-6 grid gap-3 md:grid-cols-3'>
					<ToolLink
						href='/dashboard/tools/password-generator'
						icon={<KeyRound className='h-4 w-4' />}
						title='Password generator'
						description='Create strong project passwords.'
					/>
					<ToolLink
						href='/dashboard/tools/jwt-generator'
						icon={<ShieldCheck className='h-4 w-4' />}
						title='JWT generator'
						description='Generate access and refresh secrets.'
					/>
					<ToolLink
						href='/dashboard/templates'
						icon={<LayoutTemplate className='h-4 w-4' />}
						title='Templates'
						description='Apply common .env presets.'
					/>
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

function ToolLink({
	href,
	icon,
	title,
	description,
}: {
	href: string
	icon: ReactNode
	title: string
	description: string
}) {
	return (
		<Link
			href={href}
			className='rounded-lg border border-border bg-card p-4 text-card-foreground transition hover:border-muted-foreground'
		>
			<div className='flex items-center gap-2 text-sm font-semibold'>
				{icon}
				{title}
			</div>
			<p className='mt-1 text-sm text-muted-foreground'>{description}</p>
		</Link>
	)
}
