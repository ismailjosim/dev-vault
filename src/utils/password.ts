import bcryptjs from 'bcryptjs'

const MIN_PASSWORD_LENGTH = 8
const SALT_ROUNDS = 10

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid flag and message
 */
export function validatePassword(password: string): {
	isValid: boolean
	message: string
} {
	if (!password) {
		return { isValid: false, message: 'Password is required' }
	}

	if (password.length < MIN_PASSWORD_LENGTH) {
		return {
			isValid: false,
			message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
		}
	}

	// Optional: Enforce strong password requirements
	// if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
	//   return {
	//     isValid: false,
	//     message: "Password must contain uppercase, lowercase, numbers, and special characters",
	//   };
	// }

	return { isValid: true, message: 'Password is valid' }
}

/**
 * Hash a password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
	try {
		const salt = await bcryptjs.genSalt(SALT_ROUNDS)
		return await bcryptjs.hash(password, salt)
	} catch (error) {
		console.error('Password hashing error:', error)
		throw new Error('Failed to hash password')
	}
}

/**
 * Compare password with hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches hash
 */
export async function comparePassword(
	password: string,
	hash: string,
): Promise<boolean> {
	try {
		return await bcryptjs.compare(password, hash)
	} catch (error) {
		console.error('Password comparison error:', error)
		throw new Error('Failed to compare password')
	}
}

/**
 * Check if password meets minimum requirements
 * @param password - Password to check
 * @returns True if password meets minimum requirements
 */
export function meetsMinimumRequirements(password: string): boolean {
	return Boolean(password && password.length >= MIN_PASSWORD_LENGTH)
}
