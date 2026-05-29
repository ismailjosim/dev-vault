import CryptoJS from 'crypto-js'

// Encryption key from environment or default (should be stored securely)
const ENCRYPTION_KEY =
	process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production'

/**
 * Encrypt a string using AES-256
 * @param text - The text to encrypt
 * @returns Encrypted string
 */
export function encryptValue(text: string): string {
	try {
		return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
	} catch (error) {
		console.error('Encryption error:', error)
		throw new Error('Failed to encrypt value')
	}
}

/**
 * Decrypt an encrypted string
 * @param encryptedText - The encrypted text
 * @returns Decrypted string
 */
export function decryptValue(encryptedText: string): string {
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
		const decrypted = bytes.toString(CryptoJS.enc.Utf8)

		if (!decrypted) {
			throw new Error('Decryption resulted in empty string')
		}

		return decrypted
	} catch (error) {
		console.error('Decryption error:', error)
		throw new Error('Failed to decrypt value')
	}
}

/**
 * Hash a value using SHA-256 (for non-reversible hashing)
 * @param text - The text to hash
 * @returns Hashed string
 */
export function hashValue(text: string): string {
	try {
		return CryptoJS.SHA256(text).toString()
	} catch (error) {
		console.error('Hashing error:', error)
		throw new Error('Failed to hash value')
	}
}

/**
 * Generate a random secret
 * @param length - Length of the secret (default: 32)
 * @returns Random secret string
 */
export function generateSecret(length: number = 32): string {
	try {
		return CryptoJS.lib.WordArray.random(length / 4).toString()
	} catch (error) {
		console.error('Secret generation error:', error)
		throw new Error('Failed to generate secret')
	}
}
