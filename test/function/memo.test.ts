// test/function/memo.test.ts
import { fn } from '../../src';

describe('fn.memo', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should cache results based on arguments', () => {
		const expensiveFn = jest.fn(
			(a: number, b: number) => a + b
		) as unknown as (...args: unknown[]) => unknown;
		const memoized = fn.memo(expensiveFn) as (
			a: number,
			b: number
		) => number;

		// First call should execute the function
		expect(memoized(1, 2)).toBe(3);
		expect(expensiveFn).toHaveBeenCalledTimes(1);

		// Second call with same args should use cache
		expect(memoized(1, 2)).toBe(3);
		expect(expensiveFn).toHaveBeenCalledTimes(1);

		// Call with different args should execute the function again
		expect(memoized(3, 4)).toBe(7);
		expect(expensiveFn).toHaveBeenCalledTimes(2);
	});

	it('should respect maxSize option', () => {
		const expensiveFn = jest.fn((x: number) => x * 2) as unknown as (
			...args: unknown[]
		) => unknown;
		const memoized = fn.memo(expensiveFn, { maxSize: 2 }) as (
			x: number
		) => number;

		memoized(1); // Cache: { 1 }
		memoized(2); // Cache: { 1, 2 }
		memoized(3); // Cache: { 2, 3 } - 1 is evicted

		expect(expensiveFn).toHaveBeenCalledTimes(3);

		// This should hit the cache
		memoized(3);
		expect(expensiveFn).toHaveBeenCalledTimes(3);

		// This should hit the cache
		memoized(2);
		expect(expensiveFn).toHaveBeenCalledTimes(3);

		// This should miss the cache since 1 was evicted
		memoized(1);
		expect(expensiveFn).toHaveBeenCalledTimes(4);
	});

	it('should respect ttl option', () => {
		const expensiveFn = jest.fn((x: number) => x * 2) as unknown as (
			...args: unknown[]
		) => unknown;
		const memoized = fn.memo(expensiveFn, { ttl: 1000 }) as (
			x: number
		) => number;

		memoized(1);
		expect(expensiveFn).toHaveBeenCalledTimes(1);

		// Within TTL should hit cache
		jest.advanceTimersByTime(500);
		memoized(1);
		expect(expensiveFn).toHaveBeenCalledTimes(1);

		// After TTL should miss cache
		jest.advanceTimersByTime(600); // Total: 1100ms
		memoized(1);
		expect(expensiveFn).toHaveBeenCalledTimes(2);
	});

	it('should use custom keyGenerator', () => {
		type TestObject = { id: number; name: string };
		const expensiveFn = jest.fn((obj: TestObject) => obj.id) as unknown as (
			...args: unknown[]
		) => unknown;
		const memoized = fn.memo(expensiveFn, {
			keyGenerator: (obj) => String((obj as TestObject).id),
		}) as (obj: TestObject) => number;

		// Different objects with same ID should hit cache
		memoized({ id: 1, name: 'Alice' });
		memoized({ id: 1, name: 'Bob' });

		expect(expensiveFn).toHaveBeenCalledTimes(1);

		// Different ID should miss cache
		memoized({ id: 2, name: 'Charlie' });
		expect(expensiveFn).toHaveBeenCalledTimes(2);
	});

	it('should respect invalidateOn option', () => {
		const expensiveFn = jest.fn(
			(constantArg: number, changingArg: { value: number }) => {
				return constantArg + changingArg.value;
			}
		) as unknown as (...args: unknown[]) => unknown;

		const memoized = fn.memo(expensiveFn, {
			invalidateOn: [1], // Invalidate cache when second argument changes
		}) as (constantArg: number, changingArg: { value: number }) => number;

		const obj1 = { value: 10 };
		const obj2 = { value: 20 };

		memoized(5, obj1);
		expect(expensiveFn).toHaveBeenCalledTimes(1);

		// Same args, should hit cache
		memoized(5, obj1);
		expect(expensiveFn).toHaveBeenCalledTimes(1);

		// Different object with different value, should miss cache
		memoized(5, obj2);
		expect(expensiveFn).toHaveBeenCalledTimes(2);

		// Changing the value of a referenced object should invalidate
		obj1.value = 30;
		memoized(5, obj1);
		expect(expensiveFn).toHaveBeenCalledTimes(3);
	});

	it('should provide a way to manually clear the cache', () => {
		const expensiveFn = jest.fn((x: number) => x * 2) as unknown as (
			...args: unknown[]
		) => unknown;
		const memoized = fn.memo(expensiveFn) as ((x: number) => number) & {
			clear: () => void;
		};

		memoized(1);
		memoized(2);
		expect(expensiveFn).toHaveBeenCalledTimes(2);

		// Clear the cache
		memoized.clear();

		// Should miss cache
		memoized(1);
		memoized(2);
		expect(expensiveFn).toHaveBeenCalledTimes(4);
	});

	it('should provide a way to invalidate specific keys', () => {
		const expensiveFn = jest.fn((x: number) => x * 2) as unknown as (
			...args: unknown[]
		) => unknown;
		const memoized = fn.memo(expensiveFn) as ((x: number) => number) & {
			invalidate: (x: number) => void;
		};

		memoized(1);
		memoized(2);
		expect(expensiveFn).toHaveBeenCalledTimes(2);

		// Invalidate specific key
		memoized.invalidate(1);

		// Should miss cache for invalidated key
		memoized(1);
		expect(expensiveFn).toHaveBeenCalledTimes(3);

		// Should hit cache for non-invalidated key
		memoized(2);
		expect(expensiveFn).toHaveBeenCalledTimes(3);
	});
});
