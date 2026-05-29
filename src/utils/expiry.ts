export type ExpiryStatus = 'none' | 'active' | 'soon' | 'expired'

export function daysUntilExpiry(date?: string | Date | null) {
	if (!date) return null

	const expiryDate = new Date(date)
	const today = new Date()
	expiryDate.setHours(0, 0, 0, 0)
	today.setHours(0, 0, 0, 0)

	return Math.ceil((expiryDate.getTime() - today.getTime()) / 86_400_000)
}

export function isExpired(date?: string | Date | null) {
	const days = daysUntilExpiry(date)
	return days !== null && days < 0
}

export function getExpiryStatus(date?: string | Date | null): ExpiryStatus {
	const days = daysUntilExpiry(date)

	if (days === null) return 'none'
	if (days < 0) return 'expired'
	if (days <= 7) return 'soon'
	return 'active'
}

export function getExpiryLabel(date?: string | Date | null) {
	const days = daysUntilExpiry(date)

	if (days === null) return 'No expiry'
	if (days < 0) return `Expired ${Math.abs(days)}d ago`
	if (days === 0) return 'Expires today'
	if (days <= 7) return `Expires in ${days}d`
	if (!date) return 'No expiry'
	return `Expires ${new Date(date).toLocaleDateString()}`
}
