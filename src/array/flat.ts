// src/array/flat.ts
/**
 * Flattens a nested array structure
 * @param array Array to flatten
 * @param depth Maximum depth to flatten
 */
export function flat<T>(array: T[], depth = 1): T[] {
	function flatten(arr: T[], currentDepth: number): T[] {
		return arr.reduce((acc, val) => {
			if (Array.isArray(val) && currentDepth < depth) {
				acc.push(...flatten(val as T[], currentDepth + 1));
			} else {
				acc.push(val);
			}
			return acc;
		}, [] as T[]);
	}

	return flatten(array, 0);
}
