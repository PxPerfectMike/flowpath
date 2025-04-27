// src/string/capitalize.ts

/**
 * Capitalizes the first letter of a string
 * @param str String to capitalize
 * @param lowerRest Whether to lowercase the rest of the string
 * @example
 * ```ts
 * capitalize('hello'); // 'Hello'
 * capitalize('HELLO', true); // 'Hello'
 * capitalize('HELLO', false); // 'HELLO'
 * ```
 */
export function capitalize(str: string, lowerRest = false): string {
	if (!str || typeof str !== 'string') return str;

	const firstChar = str.charAt(0).toUpperCase();
	const restOfString = lowerRest ? str.slice(1).toLowerCase() : str.slice(1);

	return firstChar + restOfString;
}
