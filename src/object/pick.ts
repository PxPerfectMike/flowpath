// src/object/pick.ts
type Indexable = Record<string | number | symbol, unknown>;

/**
 * Picks specified properties from an object
 * @param obj Source object
 * @param keys Keys to pick
 */
export function pick<T extends Indexable, K extends keyof T>(
	obj: T,
	keys: K[]
): Pick<T, K> {
	return keys.reduce((result, key) => {
		if (key in obj) {
			result[key] = obj[key];
		}
		return result;
	}, {} as Pick<T, K>);
}
