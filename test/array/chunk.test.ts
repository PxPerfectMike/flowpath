// test/array/chunk.test.ts
import { array } from '../../src';

describe('array.chunk', () => {
	it('should split an array into chunks of the specified size', () => {
		const result = array.chunk([1, 2, 3, 4, 5, 6, 7, 8], 3);
		expect(result).toEqual([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8],
		]);
	});

	it('should handle an empty array', () => {
		const result = array.chunk([], 3);
		expect(result).toEqual([]);
	});

	it('should throw an error for invalid chunk sizes', () => {
		expect(() => array.chunk([1, 2, 3], 0)).toThrow();
		expect(() => array.chunk([1, 2, 3], -1)).toThrow();
	});
});
