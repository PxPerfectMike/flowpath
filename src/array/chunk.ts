// src/array/chunk.ts
import { requireRange, requireCondition } from '../errors';

/**
 * Splits an array into chunks of the specified size
 * @param array Array to split into chunks
 * @param size Size of each chunk
 * @throws {InvalidArgumentError} If size is less than 1 or array is not an array
 */
export function chunk<T>(array: T[], size: number): T[][] {
	// Validate inputs consistently
	requireCondition(
		array,
		Array.isArray,
		'Parameter array must be an array',
		'array'
	);
	requireRange(size, 1, Number.POSITIVE_INFINITY, 'size');

	const length = array.length;
	const chunksCount = Math.ceil(length / size);

	// Create array of chunks manually
	const result: T[][] = [];
	for (let i = 0; i < chunksCount; i++) {
		result.push(array.slice(i * size, (i + 1) * size));
	}
	return result;
}
