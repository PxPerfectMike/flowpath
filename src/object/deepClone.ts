// src/object/deepClone.ts

/**
 * Creates a deep clone of an object
 * @param obj Object to clone
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => deepClone(item)) as unknown as T;
	}

	const result: Record<string, unknown> = {};

	for (const key in obj as Record<string, unknown>) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result[key] = deepClone((obj as Record<string, unknown>)[key]);
		}
	}

	return result as T;
}
