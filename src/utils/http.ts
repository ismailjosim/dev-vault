export async function readErrorMessage(
	response: Response,
	fallback: string,
): Promise<string> {
	const contentType = response.headers.get('content-type') || ''

	if (contentType.includes('application/json')) {
		const payload = (await response.json()) as {
			message?: string
			error?: string
		}

		return payload.message || payload.error || fallback
	}

	const message = await response.text()
	return message || fallback
}
