import { ProjectCard, ProjectSummary } from '@/components/projects/ProjectCard'

export function ProjectList({ projects }: { projects: ProjectSummary[] }) {
	if (projects.length === 0) {
		return (
			<div className='border-border bg-card rounded-lg border border-dashed p-8 text-center'>
				<h2 className='text-card-foreground text-base font-semibold'>
					No projects
				</h2>
				<p className='text-muted-foreground mt-2 text-sm'>
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
