// test/array/window.test.ts
import { array } from '../../src';

describe('array.window', () => {
	it('should create sliding windows of the specified size', (done) => {
		const result = array.window([1, 2, 3, 4, 5], 3);
		expect(result).toEqual([
			[1, 2, 3],
			[2, 3, 4],
			[3, 4, 5],
		]);
		done();
	});

	it('should respect the step parameter', (done) => {
		const result = array.window([1, 2, 3, 4, 5, 6], 2, 2);
		expect(result).toEqual([
			[1, 2],
			[3, 4],
			[5, 6],
		]);
		done();
	});

	it('should handle step larger than window size', (done) => {
		const result = array.window([1, 2, 3, 4, 5, 6, 7, 8], 2, 3);
		expect(result).toEqual([
			[1, 2],
			[4, 5],
			[7, 8],
		]);
		done();
	});

	it('should return an empty array if the window size is larger than the array', (done) => {
		const result = array.window([1, 2, 3], 4);
		expect(result).toEqual([]);
		done();
	});

	it('should handle an empty array', (done) => {
		const result = array.window([], 2);
		expect(result).toEqual([]);
		done();
	});
});
