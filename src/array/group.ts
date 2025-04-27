// src/array/group.ts
/**
 * Groups array elements by a key
 * @param array Array to group
 * @param keySelector Function that returns the key for each element
 */
export function group<T, K extends string | number | symbol>(
	array: T[],
	keySelector: (item: T) => K
): Record<K, T[]> {
	return array.reduce((groups, item) => {
		const key = keySelector(item);
		if (!groups[key]) {
			groups[key] = [];
		}
		groups[key].push(item);
		return groups;
	}, {} as Record<K, T[]>);
}
