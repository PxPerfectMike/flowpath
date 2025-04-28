// src/object/paths.ts
import { requireType, InvalidArgumentError } from '../errors';

/**
 * Gets all paths in an object
 * @param obj Object to get paths from
 * @param prefix Current path prefix
 * @throws {InvalidArgumentError} If obj is not an object
 */
export function paths(obj: Record<string, unknown>, prefix = ''): string[] {
	// Validate inputs consistently
	requireType(obj, 'object', 'obj');

	// Additional validation: ensure it's not null, an array, etc.
	if (obj === null || Array.isArray(obj)) {
		throw new InvalidArgumentError(
			`Parameter 'obj' must be a non-null, non-array object`,
			'obj',
			obj
		);
	}

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
