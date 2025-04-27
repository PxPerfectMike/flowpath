// src/array/partition.ts
/**
 * Partitions an array into two arrays based on a predicate
 * @param array Array to partition
 * @param predicate Function that determines which partition an element belongs to
 */
export function partition<T>(
	array: T[],
	predicate: (item: T) => boolean
): [T[], T[]] {
	const matches: T[] = [];
	const nonMatches: T[] = [];

	for (const item of array) {
		if (predicate(item)) {
			matches.push(item);
		} else {
			nonMatches.push(item);
		}
	}

	return [matches, nonMatches];
}
