// src/object/omit.ts
type Indexable = Record<string | number | symbol, unknown>;

/**
 * Omits specified properties from an object
 * @param obj Source object
 * @param keys Keys to omit
 */
export function omit<T extends Indexable, K extends keyof T>(
	obj: T,
	keys: K[]
): Omit<T, K> {
	const result = { ...obj } as Omit<T, K>;

	for (const key of keys) {
		delete (result as T)[key];
	}

	return result;
}
