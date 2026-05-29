import { ParsedEnvVariable } from '@/utils/env-parser'

export type EnvComparison = {
	available: string[]
	missing: string[]
	extra: string[]
}

export function compareEnvFiles(
	exampleVariables: ParsedEnvVariable[],
	projectVariables: ParsedEnvVariable[],
): EnvComparison {
	const exampleKeys = uniqueSorted(
		exampleVariables.map((variable) => variable.key),
	)
	const projectKeys = uniqueSorted(
		projectVariables.map((variable) => variable.key),
	)
	const projectKeySet = new Set(projectKeys)
	const exampleKeySet = new Set(exampleKeys)

	return {
		available: exampleKeys.filter((key) => projectKeySet.has(key)),
		missing: exampleKeys.filter((key) => !projectKeySet.has(key)),
		extra: projectKeys.filter((key) => !exampleKeySet.has(key)),
	}
}

export function getMissingVars(
	exampleVariables: ParsedEnvVariable[],
	projectVariables: ParsedEnvVariable[],
) {
	return compareEnvFiles(exampleVariables, projectVariables).missing
}

export function getExtraVars(
	exampleVariables: ParsedEnvVariable[],
	projectVariables: ParsedEnvVariable[],
) {
	return compareEnvFiles(exampleVariables, projectVariables).extra
}

export function generateComparisonReport(
	projectName: string,
	comparison: EnvComparison,
) {
	return [
		`Env Comparison for: ${projectName}`,
		'',
		`Available Variables (${comparison.available.length}):`,
		...comparison.available.map((key) => `- ${key}`),
		'',
		`Missing Variables (${comparison.missing.length}):`,
		...comparison.missing.map((key) => `- ${key}`),
		'',
		`Extra Variables (${comparison.extra.length}):`,
		...comparison.extra.map((key) => `- ${key}`),
	].join('\n')
}

function uniqueSorted(values: string[]) {
	return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}
