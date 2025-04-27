// src/string/camelCase.ts

/**
 * Converts a string to camelCase
 * @param str String to convert
 * @example
 * ```ts
 * camelCase('hello world'); // 'helloWorld'
 * camelCase('foo-bar'); // 'fooBar'
 * camelCase('FOO_BAR'); // 'fooBar'
 * ```
 */
export function camelCase(str: string): string {
	return str
		.toLowerCase()
		.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
		.replace(/^[A-Z]/, (c) => c.toLowerCase());
}
