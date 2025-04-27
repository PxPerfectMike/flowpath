// src/string/truncate.ts

/**
 * Truncates a string to a maximum length
 * @param str String to truncate
 * @param maxLength Maximum length
 * @param suffix Suffix to add to truncated string
 * @example
 * ```ts
 * truncate('Hello, World!', 5); // 'Hello...'
 * truncate('Hello, World!', 5, ' [more]'); // 'Hello [more]'
 * ```
 */
export function truncate(
	str: string,
	maxLength: number,
	suffix = '...'
): string {
	if (str.length <= maxLength) {
		return str;
	}

	return str.slice(0, maxLength - suffix.length) + suffix;
}
