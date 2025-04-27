// src/string/escapeRegExp.ts

/**
 * Escapes special characters in a string for use in a regular expression
 * @param str String to escape
 * @example
 * ```ts
 * escapeRegExp('[hello].world+'); // '\\[hello\\]\\.world\\+'
 * new RegExp(escapeRegExp('[hello].world+')); // /\[hello\]\.world\+/
 * ```
 */
export function escapeRegExp(str: string): string {
	// Escape special characters used in regular expressions
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
