// src/object/merge.ts
type Indexable = Record<string | number | symbol, unknown>;

/**
 * Deep merges multiple objects
 * @param objects Objects to merge
 */
export function merge<T extends Indexable>(...objects: T[]): T {
	return objects.reduce((result, obj) => {
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const resultValue = result[key];
				const objValue = obj[key];

				if (
					resultValue &&
					objValue &&
					typeof resultValue === 'object' &&
					typeof objValue === 'object' &&
					!Array.isArray(resultValue) &&
					!Array.isArray(objValue)
				) {
					result[key] = merge(
						resultValue as Indexable,
						objValue as Indexable
					) as T[Extract<keyof T, string>];
				} else {
					result[key] = objValue;
				}
			}
		}

		return result;
	}, {} as T);
}
