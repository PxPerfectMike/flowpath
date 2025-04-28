// test/array/zip.test.ts
import { array } from '../../src';

describe('array.zip', () => {
	it('should zip multiple arrays together', () => {
		const array1 = [1, 2, 3];
		const array2 = ['a', 'b', 'c'];
		const array3 = [true, false, true];

		const result = array.zip(array1, array2, array3);

		expect(result).toEqual([
			[1, 'a', true],
			[2, 'b', false],
			[3, 'c', true],
		]);
	});

	it('should handle arrays of different lengths by using the shortest length', () => {
		const array1 = [1, 2, 3, 4, 5];
		const array2 = ['a', 'b', 'c'];
		const array3 = [true, false, true, false];

		const result = array.zip(array1, array2, array3);

		expect(result).toEqual([
			[1, 'a', true],
			[2, 'b', false],
			[3, 'c', true],
		]);
	});

	it('should handle empty arrays', () => {
		const array1 = [1, 2, 3];
		const array2 = [] as string[];

		const result = array.zip(array1, array2);

		expect(result).toEqual([]);
	});

	it('should handle a single array by returning arrays of one element', () => {
		const array1 = [1, 2, 3];

		const result = array.zip(array1);

		expect(result).toEqual([[1], [2], [3]]);
	});

	it('should handle no arrays by returning an empty array', () => {
		const result = array.zip();

		expect(result).toEqual([]);
	});
});
