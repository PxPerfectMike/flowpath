// src/array/zip.ts
/**
 * Combines multiple arrays into an array of tuples
 * @param arrays Arrays to zip together
 */
export function zip<T extends unknown[][]>(...arrays: T): unknown[][] {
	const minLength = Math.min(...arrays.map((arr) => arr.length));
	const result: unknown[][] = [];

	for (let i = 0; i < minLength; i++) {
		result.push(arrays.map((arr) => arr[i]));
	}

	return result;
}
