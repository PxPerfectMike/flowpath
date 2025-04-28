// test/utils/browserCompat.test.ts
import {
	isSupported,
	arrayFrom,
	objectAssign,
	padStart,
	padEnd,
} from '../../src/utils/browserCompat';

describe('Browser compatibility utilities', () => {
	describe('isSupported', () => {
		it('should check if Promise is supported', () => {
			// This should always return true in Node.js environment
			expect(isSupported('Promise')).toBe(true);
		});

		it('should check if Map is supported', () => {
			// This should always return true in Node.js environment
			expect(isSupported('Map')).toBe(true);
		});

		// Add more tests for different features if needed
	});

	describe('arrayFrom', () => {
		it('should convert array-like objects to arrays', () => {
			const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
			expect(arrayFrom(arrayLike)).toEqual(['a', 'b', 'c']);
		});

		it('should work with iterables', () => {
			const iterable = new Set(['a', 'b', 'c']);
			expect(arrayFrom(iterable)).toEqual(['a', 'b', 'c']);
		});

		it('should work with empty array-like objects', () => {
			const arrayLike = { length: 0 };
			expect(arrayFrom(arrayLike)).toEqual([]);
		});

		it('should work with a mapping function', () => {
			const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };
			const result = arrayFrom(arrayLike, (x) => x * 2);
			expect(result).toEqual([2, 4, 6]);
		});

		// Simulate environment without Array.from
		it('should work when Array.from is not available', () => {
			const originalArrayFrom = Array.from;
			// @ts-ignore - intentionally removing the method for testing
			Array.from = undefined;

			try {
				const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
				expect(arrayFrom(arrayLike)).toEqual(['a', 'b', 'c']);
			} finally {
				// Restore Array.from
				Array.from = originalArrayFrom;
			}
		});
	});

	describe('objectAssign', () => {
		it('should merge objects', () => {
			const target = { a: 1, b: 2 };
			const source = { b: 3, c: 4 };
			expect(objectAssign(target, source)).toEqual({ a: 1, b: 3, c: 4 });
		});

		it('should handle empty objects', () => {
			const target = {};
			const source = { a: 1 };
			expect(objectAssign(target, source)).toEqual({ a: 1 });
		});

		// Simulate environment without Object.assign
		it('should work when Object.assign is not available', () => {
			const originalObjectAssign = Object.assign;
			// @ts-ignore - intentionally removing the method for testing
			Object.assign = undefined;

			try {
				const target = { a: 1, b: 2 };
				const source = { b: 3, c: 4 };
				expect(objectAssign(target, source)).toEqual({
					a: 1,
					b: 3,
					c: 4,
				});
			} finally {
				// Restore Object.assign
				Object.assign = originalObjectAssign;
			}
		});
	});

	describe('padStart', () => {
		it('should pad the start of a string', () => {
			expect(padStart('42', 5)).toBe('   42');
			expect(padStart('42', 5, '0')).toBe('00042');
		});

		it('should not pad if string length exceeds target length', () => {
			expect(padStart('Hello', 3)).toBe('Hello');
		});

		// Simulate environment without String.prototype.padStart
		it('should work when String.prototype.padStart is not available', () => {
			const originalPadStart = String.prototype.padStart;
			// @ts-ignore - intentionally removing the method for testing
			String.prototype.padStart = undefined;

			try {
				expect(padStart('42', 5)).toBe('   42');
				expect(padStart('42', 5, '0')).toBe('00042');
			} finally {
				// Restore String.prototype.padStart
				String.prototype.padStart = originalPadStart;
			}
		});
	});

	describe('padEnd', () => {
		it('should pad the end of a string', () => {
			expect(padEnd('42', 5)).toBe('42   ');
			expect(padEnd('42', 5, '0')).toBe('42000');
		});

		it('should not pad if string length exceeds target length', () => {
			expect(padEnd('Hello', 3)).toBe('Hello');
		});

		// Simulate environment without String.prototype.padEnd
		it('should work when String.prototype.padEnd is not available', () => {
			const originalPadEnd = String.prototype.padEnd;
			// @ts-ignore - intentionally removing the method for testing
			String.prototype.padEnd = undefined;

			try {
				expect(padEnd('42', 5)).toBe('42   ');
				expect(padEnd('42', 5, '0')).toBe('42000');
			} finally {
				// Restore String.prototype.padEnd
				String.prototype.padEnd = originalPadEnd;
			}
		});
	});
});
