// src/array/window.ts
/**
 * Creates sliding windows of the specified size
 * @param array Array to create windows from
 * @param size Size of each window
 * @param step Step between windows
 */
export function window<T>(array: T[], size: number, step = 1): T[][] {
	const result: T[][] = [];

	if (size > array.length) {
		return [];
	}

	for (let i = 0; i <= array.length - size; i += step) {
		result.push(array.slice(i, i + size));
	}

	return result;
}
