import { ProjectCard, ProjectSummary } from '@/components/projects/ProjectCard'

export function ProjectList({ projects }: { projects: ProjectSummary[] }) {
	if (projects.length === 0) {
		return (
			<div className='rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center'>
				<h2 className='text-base font-semibold text-zinc-950'>No projects</h2>
				<p className='mt-2 text-sm text-zinc-600'>
					Create your first project to start storing environment variables.
				</p>
			</div>
		)
	}

	return (
		<div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
			{projects.map((project) => (
				<ProjectCard key={project._id} project={project} />
			))}
		</div>
	)
}
