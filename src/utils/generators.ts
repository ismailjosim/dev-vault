export type PasswordOptions = {
	length: number
	uppercase: boolean
	lowercase: boolean
	numbers: boolean
	symbols: boolean
	excludeConfusing: boolean
}

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
const numberChars = '0123456789'
const symbolChars = '!@#$%^&*'
const confusingChars = new Set(['O', '0', 'l', '1', 'I'])

function secureRandomIndex(max: number) {
	const values = new Uint32Array(1)
	crypto.getRandomValues(values)
	return values[0] % max
}

function cleanCharacters(characters: string, excludeConfusing: boolean) {
	if (!excludeConfusing) return characters
	return characters
		.split('')
		.filter((character) => !confusingChars.has(character))
		.join('')
}

export function generateRandomString(length: number, characters: string) {
	if (length <= 0 || characters.length === 0) return ''

	return Array.from(
		{ length },
		() => characters[secureRandomIndex(characters.length)],
	).join('')
}

export function generatePassword(options: PasswordOptions) {
	const groups = [
		options.uppercase &&
			cleanCharacters(uppercaseChars, options.excludeConfusing),
		options.lowercase &&
			cleanCharacters(lowercaseChars, options.excludeConfusing),
		options.numbers && cleanCharacters(numberChars, options.excludeConfusing),
		options.symbols && symbolChars,
	].filter(Boolean) as string[]

	if (groups.length === 0) {
		throw new Error('Choose at least one character type')
	}

	const characters = groups.join('')
	const requiredCharacters = groups.map(
		(group) => group[secureRandomIndex(group.length)],
	)
	const remaining = generateRandomString(
		Math.max(options.length - requiredCharacters.length, 0),
		characters,
	).split('')
	const password = [...requiredCharacters, ...remaining]

	for (let index = password.length - 1; index > 0; index -= 1) {
		const swapIndex = secureRandomIndex(index + 1)
		;[password[index], password[swapIndex]] = [
			password[swapIndex],
			password[index],
		]
	}

	return password.slice(0, options.length).join('')
}

export function generateJWTSecret(length = 64) {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
	return generateRandomString(Math.max(length, 64), characters)
}
