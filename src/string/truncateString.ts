// src/string/truncateString.ts
import { requireRange, requireType } from '../errors';

/**
 * Truncates a string to a maximum length by words, trying to preserve whole words
 * @param str String to truncate
 * @param maxLength Maximum length
 * @param suffix Suffix to add to truncated string
 * @throws {InvalidArgumentError} If str is not a string or maxLength is negative
 * @example
 * ```ts
 * truncateString('Hello world and universe', 12); // 'Hello world...'
 * truncateString('Hello world and universe', 20, ' [read more]'); // 'Hello world [read more]'
 * ```
 */
export function truncateString(
	str: string,
	maxLength: number,
	suffix = '...'
): string {
	// Validate inputs consistently using the error utility functions
	requireType(str, 'string', 'str');
	requireRange(maxLength, 0, Number.POSITIVE_INFINITY, 'maxLength');
	requireType(suffix, 'string', 'suffix');

	if (str.length <= maxLength) {
		return str;
	}

	// Adjust maxLength to account for suffix
	const truncateLength = maxLength - suffix.length;

	// Find the last space within the truncate length
	const lastSpaceIndex = str.lastIndexOf(' ', truncateLength);

	// If no space found, or if it's too early in the string (less than half maxLength),
	// just truncate at maxLength
	if (lastSpaceIndex === -1 || lastSpaceIndex < truncateLength / 2) {
		return str.slice(0, truncateLength) + suffix;
	}

	return str.slice(0, lastSpaceIndex) + suffix;
}
