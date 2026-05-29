import { getExpiryLabel, getExpiryStatus } from '@/utils/expiry'

export function ExpiryBadge({ expiryDate }: { expiryDate?: string | null }) {
	const status = getExpiryStatus(expiryDate)

	if (status === 'none') return null

	const className =
		status === 'expired'
			? 'bg-danger-foreground text-danger'
			: status === 'soon'
				? 'bg-amber-100 text-amber-800'
				: 'bg-emerald-100 text-emerald-800'

	return (
		<span className={`rounded px-2 py-1 text-xs font-medium ${className}`}>
			{getExpiryLabel(expiryDate)}
		</span>
	)
}
