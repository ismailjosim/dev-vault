export function CodeEditor({
	value,
	onChange,
}: {
	value: string
	onChange: (value: string) => void
}) {
	return (
		<textarea
			value={value}
			onChange={(event) => onChange(event.target.value)}
			rows={16}
			className='border-border bg-background text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none'
			placeholder='Paste or write your reusable code here'
		/>
	)
}
