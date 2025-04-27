// src/object/paths.ts

/**
 * Gets all paths in an object
 * @param obj Object to get paths from
 * @param prefix Current path prefix
 */
export function paths(obj: Record<string, unknown>, prefix = ''): string[] {
	let result: string[] = [];

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const fullPath = prefix ? `${prefix}.${key}` : key;
			result.push(fullPath);

			if (
				obj[key] &&
				typeof obj[key] === 'object' &&
				!Array.isArray(obj[key])
			) {
				result = result.concat(
					paths(obj[key] as Record<string, unknown>, fullPath)
				);
			}
		}
	}

	return result;
}
