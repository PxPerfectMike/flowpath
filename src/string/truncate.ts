// src/string/truncate.ts
import { requireDefined, requireRange } from '../errors';

/**
 * Truncates a string to a maximum length
 * @param str String to truncate
 * @param maxLength Maximum length
 * @param suffix Suffix to add to truncated string
 * @throws {InvalidArgumentError} If str is not a string or maxLength is negative
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
	// Validate inputs
	requireDefined(str, 'str');
	if (typeof str !== 'string') {
		throw new Error(`Parameter 'str' must be of type string`);
	}

	requireRange(maxLength, 0, Number.POSITIVE_INFINITY, 'maxLength');

	requireDefined(suffix, 'suffix');
	if (typeof suffix !== 'string') {
		throw new Error(`Parameter 'suffix' must be of type string`);
	}

	if (str.length <= maxLength) {
		return str;
	}

	// If maxLength is less than suffix length, just return the suffix truncated to maxLength
	if (maxLength < suffix.length) {
		return suffix.slice(0, maxLength);
	}

	return str.slice(0, maxLength - suffix.length) + suffix;
}
