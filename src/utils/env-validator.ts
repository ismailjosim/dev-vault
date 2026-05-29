import { parseEnvText, validateKeyName } from '@/utils/env-parser'

export type EnvValidationIssue = {
	lineNumber?: number
	key?: string
	severity: 'error' | 'warning'
	message: string
}

export function validateEnvFile(content: string) {
	const parsed = parseEnvText(content)
	const issues: EnvValidationIssue[] = parsed.invalidLines.map((line) => ({
		lineNumber: line.lineNumber,
		severity: 'error',
		message: `${line.reason}: ${line.content}`,
	}))

	const allKeys = new Map<string, number[]>()

	content.split(/\r?\n/).forEach((rawLine, index) => {
		const trimmed = rawLine.trim()
		if (!trimmed || trimmed.startsWith('#')) return

		const line = trimmed.startsWith('export ')
			? trimmed.slice('export '.length).trim()
			: trimmed
		const separatorIndex = line.indexOf('=')
		if (separatorIndex === -1) return

		const key = line.slice(0, separatorIndex).trim()
		const rawValue = line.slice(separatorIndex + 1).trim()

		if (!validateKeyName(key)) return

		allKeys.set(key, [...(allKeys.get(key) || []), index + 1])

		if (!rawValue) {
			issues.push({
				lineNumber: index + 1,
				key,
				severity: 'warning',
				message: 'Value is empty',
			})
		}

		if (rawValue.length > 10000) {
			issues.push({
				lineNumber: index + 1,
				key,
				severity: 'warning',
				message: 'Value is unusually long',
			})
		}

		if (
			key.includes('URL') &&
			rawValue &&
			!/^['"]?https?:\/\//.test(rawValue)
		) {
			issues.push({
				lineNumber: index + 1,
				key,
				severity: 'warning',
				message: 'URL-like key does not look like an HTTP URL',
			})
		}
	})

	for (const [key, lines] of allKeys) {
		if (lines.length > 1) {
			issues.push({
				key,
				severity: 'error',
				message: `Duplicate key on lines ${lines.join(', ')}`,
			})
		}
	}

	return {
		valid: issues.every((issue) => issue.severity !== 'error'),
		variableCount: parsed.variables.length,
		issues,
		variables: parsed.variables,
	}
}
