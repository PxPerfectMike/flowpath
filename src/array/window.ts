// src/array/window.ts
import {
	requireRange,
	requireCondition,
	InvalidArgumentError,
} from '../errors';

/**
 * Creates sliding windows of the specified size
 * @param array Array to create windows from
 * @param size Size of each window
 * @param step Step between windows
 * @throws {InvalidArgumentError} If parameters are invalid
 */
export function window<T>(array: T[], size: number, step = 1): T[][] {
	// Validate inputs consistently
	requireCondition(
		array,
		Array.isArray,
		'Parameter array must be an array',
		'array'
	);
	requireRange(size, 1, Number.POSITIVE_INFINITY, 'size');
	requireRange(step, 1, Number.POSITIVE_INFINITY, 'step');

	const result: T[][] = [];

	if (size > array.length) {
		// Return empty array when window size is larger than array length
		// This is an expected behavior, not an error condition
		return [];
	}

	for (let i = 0; i <= array.length - size; i += step) {
		result.push(array.slice(i, i + size));
	}

	return result;
}
