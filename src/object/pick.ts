// src/object/pick.ts
import { requireType, requireCondition, InvalidArgumentError } from '../errors';

type Indexable = Record<string | number | symbol, unknown>;

/**
 * Picks specified properties from an object
 * @param obj Source object
 * @param keys Keys to pick
 * @throws {InvalidArgumentError} If parameters are invalid
 */
export function pick<T extends Indexable, K extends keyof T>(
	obj: T,
	keys: K[]
): Pick<T, K> {
	// Validate inputs consistently
	requireType(obj, 'object', 'obj');

	// Null check
	if (obj === null) {
		throw new InvalidArgumentError(
			`Parameter 'obj' must be a non-null object`,
			'obj',
			obj
		);
	}

	// Validate keys is an array
	requireCondition(
		keys,
		Array.isArray,
		`Parameter 'keys' must be an array`,
		'keys'
	);

	return keys.reduce((result, key) => {
		if (key in obj) {
			result[key] = obj[key];
		}
		return result;
	}, {} as Pick<T, K>);
}
