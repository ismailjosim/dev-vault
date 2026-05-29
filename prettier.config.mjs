/** @type {import('prettier').Config} */
const config = {
	plugins: ['prettier-plugin-tailwindcss'],
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	trailingComma: 'all',
	tabWidth: 2,
	useTabs: true,
	printWidth: 80,
	arrowParens: 'always',
	endOfLine: 'lf',
}

export default config
