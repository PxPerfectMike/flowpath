// src/array/chunk.ts
/**
 * Splits an array into chunks of the specified size
 * @param array Array to split into chunks
 * @param size Size of each chunk
 */
export function chunk<T>(array: T[], size: number): T[][] {
	if (size < 1) {
		throw new Error('Chunk size must be at least 1');
	}

	return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
		array.slice(index * size, (index + 1) * size)
	);
}
