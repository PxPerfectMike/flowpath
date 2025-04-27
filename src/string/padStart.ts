// src/string/padStart.ts

/**
 * Pads the start of a string with a given string until it reaches the desired length
 * @param str String to pad
 * @param targetLength Target length of the resulting string
 * @param padString String to pad with
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
	// Use native String.padStart if available
	if (typeof String.prototype.padStart === 'function') {
		return String(str).padStart(targetLength, padString);
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

	return padding.slice(0, padLength) + inputStr;
}
