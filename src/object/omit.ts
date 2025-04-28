// src/object/omit.ts
import { requireType, requireCondition, InvalidArgumentError } from '../errors';

type Indexable = Record<string | number | symbol, unknown>;

/**
 * Omits specified properties from an object
 * @param obj Source object
 * @param keys Keys to omit
 * @throws {InvalidArgumentError} If parameters are invalid
 */
export function omit<T extends Indexable, K extends keyof T>(
	obj: T,
	keys: K[]
): Omit<T, K> {
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

	const result = { ...obj } as Omit<T, K>;

	for (const key of keys) {
		delete (result as T)[key];
	}

	return result;
}
