// src/string/padStart.ts
import { requireRange, requireDefined } from '../errors';
import { padStart as compatPadStart } from '../utils/browserCompat';

/**
 * Pads the start of a string with a given string until it reaches the desired length
 * @param str String to pad
 * @param targetLength Target length of the resulting string
 * @param padString String to pad with
 * @throws {InvalidArgumentError} If parameters are invalid
 * @example
 * ```ts
 * padStart('42', 5); // '   42'
 * padStart('42', 5, '0'); // '00042'
 * padStart('Hello', 3); // 'Hello' (already exceeds target length)
 * ```
 */
export function padStart(
	str: string,
	targetLength: number,
	padString = ' '
): string {
	// Validate inputs
	requireDefined(str, 'str');
	if (typeof str !== 'string') {
		throw new Error(`Parameter 'str' must be of type string`);
	}

	requireRange(targetLength, 0, Number.MAX_SAFE_INTEGER, 'targetLength');

	requireDefined(padString, 'padString');
	if (typeof padString !== 'string') {
		throw new Error(`Parameter 'padString' must be of type string`);
	}

	// Use browser-compatible implementation
	return compatPadStart(str, targetLength, padString);
}
