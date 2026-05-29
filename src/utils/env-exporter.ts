export type ExportableEnvVariable = {
	key: string
	value: string
	note?: string
	type?: string
	environment?: string
}

export type EnvExportFormat =
	| 'env'
	| 'env.local'
	| 'env.production'
	| 'env.development'
	| 'env.test'
	| 'json'
	| 'yaml'
	| 'markdown'
	| 'example'

export function getExportFilename(
	projectSlug: string,
	format: EnvExportFormat,
) {
	if (format === 'json') return `${projectSlug}.env.json`
	if (format === 'yaml') return `${projectSlug}.env.yaml`
	if (format === 'markdown') return `${projectSlug}-env.md`
	if (format === 'example') return '.env.example'
	return `.${format}`
}

export function generateEnvFile(
	variables: ExportableEnvVariable[],
	format: EnvExportFormat,
) {
	if (format === 'json') return formatAsJSON(variables)
	if (format === 'yaml') return formatAsYAML(variables)
	if (format === 'markdown') return formatAsMarkdown(variables)
	if (format === 'example') return generateEnvExample(variables)

	return variables.map((variable) => formatEnvLine(variable)).join('\n')
}

export function generateEnvExample(variables: ExportableEnvVariable[]) {
	return variables
		.map((variable) => {
			const comment = variable.note ? `# ${variable.note}\n` : ''
			return `${comment}${variable.key}=`
		})
		.join('\n')
}

export function formatAsJSON(variables: ExportableEnvVariable[]) {
	return JSON.stringify(
		Object.fromEntries(
			variables.map((variable) => [variable.key, variable.value]),
		),
		null,
		2,
	)
}

export function formatAsYAML(variables: ExportableEnvVariable[]) {
	return variables
		.map((variable) => `${variable.key}: ${JSON.stringify(variable.value)}`)
		.join('\n')
}

export function formatAsMarkdown(variables: ExportableEnvVariable[]) {
	const rows = variables.map((variable) =>
		[
			escapeMarkdown(variable.key),
			escapeMarkdown(variable.environment || ''),
			escapeMarkdown(variable.type || ''),
			escapeMarkdown(variable.note || ''),
		].join(' | '),
	)

	return [
		'# Environment Variables',
		'',
		'| Key | Environment | Type | Note |',
		'| --- | --- | --- | --- |',
		...rows.map((row) => `| ${row} |`),
	].join('\n')
}

function formatEnvLine(variable: ExportableEnvVariable) {
	const comment = variable.note ? `# ${variable.note}\n` : ''
	return `${comment}${variable.key}=${escapeEnvValue(variable.value)}`
}

function escapeEnvValue(value: string) {
	if (!value) return ''
	if (/[\s#"']/.test(value)) return JSON.stringify(value)
	return value
}

function escapeMarkdown(value: string) {
	return value.replaceAll('|', '\\|').replaceAll('\n', ' ')
}
