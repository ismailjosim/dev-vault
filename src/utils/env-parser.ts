export type ParsedEnvVariable = {
	key: string
	value: string
}

export type InvalidEnvLine = {
	lineNumber: number
	content: string
	reason: string
}

export function parseEnvText(text: string): {
	variables: ParsedEnvVariable[]
	invalidLines: InvalidEnvLine[]
} {
	const variables: ParsedEnvVariable[] = []
	const invalidLines: InvalidEnvLine[] = []
	const seenKeys = new Set<string>()

	text.split(/\r?\n/).forEach((rawLine, index) => {
		const lineNumber = index + 1
		const trimmed = rawLine.trim()

		if (!trimmed || trimmed.startsWith('#')) return

		const line = trimmed.startsWith('export ')
			? trimmed.slice('export '.length).trim()
			: trimmed
		const separatorIndex = line.indexOf('=')

		if (separatorIndex === -1) {
			invalidLines.push({
				lineNumber,
				content: rawLine,
				reason: 'Missing equals sign',
			})
			return
		}

		const key = line.slice(0, separatorIndex).trim()
		const rawValue = line.slice(separatorIndex + 1).trim()

		if (!/^[A-Z][A-Z0-9_]*$/.test(key)) {
			invalidLines.push({
				lineNumber,
				content: rawLine,
				reason: 'Invalid key',
			})
			return
		}

		if (seenKeys.has(key)) return
		seenKeys.add(key)

		variables.push({
			key,
			value: normalizeEnvValue(rawValue),
		})
	})

	return { variables, invalidLines }
}

export function validateKeyName(key: string) {
	return /^[A-Z][A-Z0-9_]*$/.test(key)
}

export function detectEnvType(
	key: string,
	value = '',
): 'secret' | 'jwt' | 'api_key' | 'url' | 'database_url' | 'other' {
	const normalizedKey = key.toUpperCase()
	const normalizedValue = value.toLowerCase()

	if (
		normalizedKey.includes('DATABASE_URL') ||
		normalizedKey.includes('MONGODB_URI')
	) {
		return 'database_url'
	}

	if (normalizedKey.includes('JWT') || normalizedKey.includes('TOKEN')) {
		return 'jwt'
	}

	if (
		normalizedKey.includes('SECRET') ||
		normalizedKey.includes('PRIVATE') ||
		normalizedKey.includes('PASSWORD')
	) {
		return 'secret'
	}

	if (normalizedKey.includes('API_KEY') || normalizedKey.endsWith('_KEY')) {
		return 'api_key'
	}

	if (
		normalizedKey.includes('URL') ||
		normalizedKey.includes('URI') ||
		normalizedValue.startsWith('http://') ||
		normalizedValue.startsWith('https://')
	) {
		return 'url'
	}

	return 'other'
}

function normalizeEnvValue(value: string): string {
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		return value.slice(1, -1)
	}

	return stripInlineComment(value)
}

function stripInlineComment(value: string): string {
	const commentIndex = value.search(/\s#/)

	if (commentIndex === -1) {
		return value
	}

	return value.slice(0, commentIndex).trimEnd()
}
