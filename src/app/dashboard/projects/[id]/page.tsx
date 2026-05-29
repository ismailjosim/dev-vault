import { EnvVariableForm } from '@/components/env/EnvVariableForm'
import {
	EnvVariableSummary,
} from '@/components/env/EnvVariableItem'
import { EnvVariableTable } from '@/components/env/EnvVariableTable'
import { ExportMenu } from '@/components/env/ExportMenu'
import { DeleteProjectDialog } from '@/components/projects/DeleteProjectDialog'
import { ProjectSummary } from '@/components/projects/ProjectCard'
import { serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { getCurrentUser } from '@/lib/session'
import { EnvVariable } from '@/models/EnvVariable'
import { Project } from '@/models/Project'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

type ProjectDetailPageProps = {
	params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({
	params,
}: ProjectDetailPageProps) {
	const user = await getCurrentUser()
	if (!user?.id) redirect('/auth/login')

	await connectDB()
	const { id } = await params
	const project = await Project.findOne({ _id: id, userId: user.id })

	if (!project) notFound()

	const variables = await EnvVariable.find({ projectId: project._id }).sort({
		environment: 1,
		key: 1,
	})
	const safeVariables = variables.map((variable) => {
		const payload = serializeDocument<EnvVariableSummary>(variable)
		payload.value = null
		return payload
	})
	const projectPayload = serializeDocument<ProjectSummary>(project)

	return (
		<main className='min-h-screen bg-zinc-50 px-6 py-8'>
			<div className='mx-auto max-w-6xl'>
				<Link href='/dashboard' className='text-sm text-zinc-600'>
					Back to dashboard
				</Link>

				<div className='mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
					<div>
						<h1 className='text-2xl font-semibold text-zinc-950'>
							{projectPayload.projectName}
						</h1>
						<p className='mt-1 max-w-2xl text-sm text-zinc-600'>
							{projectPayload.description || 'No description yet'}
						</p>
						<div className='mt-3 flex flex-wrap gap-2'>
							<span className='rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700'>
								{projectPayload.category}
							</span>
							<span className='rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800'>
								{projectPayload.framework}
							</span>
						</div>
					</div>
					<DeleteProjectDialog projectId={projectPayload._id} />
				</div>

				<div className='mt-6'>
					<ExportMenu projectId={projectPayload._id} />
				</div>

				<div className='mt-6 grid gap-6 xl:grid-cols-[380px_1fr]'>
					<EnvVariableForm projectId={projectPayload._id} />
					<EnvVariableTable
						projectId={projectPayload._id}
						variables={safeVariables}
					/>
				</div>
			</div>
		</main>
	)
}
