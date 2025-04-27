// src/string/padEnd.ts

/**
 * Pads the end of a string with a given string until it reaches the desired length
 * @param str String to pad
 * @param targetLength Target length of the resulting string
 * @param padString String to pad with
 * @example
 * ```ts
 * padEnd('42', 5); // '42   '
 * padEnd('42', 5, '0'); // '42000'
 * padEnd('Hello', 3); // 'Hello' (already exceeds target length)
 * ```
 */
export function padEnd(
	str: string,
	targetLength: number,
	padString = ' '
): string {
	// Use native String.padEnd if available
	if (typeof String.prototype.padEnd === 'function') {
		return String(str).padEnd(targetLength, padString);
	}

	// Fallback implementation
	const inputStr = String(str);

	if (inputStr.length >= targetLength) {
		return inputStr;
	}

	const padLength = targetLength - inputStr.length;
	let padding = padString;

	// If we need to repeat the padding
	while (padding.length < padLength) {
		padding += padding;
	}

	return inputStr + padding.slice(0, padLength);
}
