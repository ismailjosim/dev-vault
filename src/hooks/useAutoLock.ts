'use client'

import { useEffect, useRef, useState } from 'react'

const activityEvents = [
	'mousedown',
	'mousemove',
	'keydown',
	'scroll',
	'touchstart',
] as const

export function useAutoLock(timeoutMinutes = 15) {
	const [isLocked, setIsLocked] = useState(false)
	const lastActivityRef = useRef(0)
	const timeoutMs = timeoutMinutes * 60 * 1000

	useEffect(() => {
		if (timeoutMinutes <= 0) return

		lastActivityRef.current = Date.now()

		function markActivity() {
			lastActivityRef.current = Date.now()
			setIsLocked(false)
		}

		for (const eventName of activityEvents) {
			window.addEventListener(eventName, markActivity, { passive: true })
		}

		const interval = window.setInterval(() => {
			if (Date.now() - lastActivityRef.current >= timeoutMs) {
				setIsLocked(true)
			}
		}, 1000)

		return () => {
			window.clearInterval(interval)
			for (const eventName of activityEvents) {
				window.removeEventListener(eventName, markActivity)
			}
		}
	}, [timeoutMinutes, timeoutMs])

	return {
		isLocked,
		resetLock: () => {
			lastActivityRef.current = Date.now()
			setIsLocked(false)
		},
	}
}
