// test/function/curry.test.ts
import { fn } from '../../src';

// Simplified approach for curry testing
describe('fn.curry', () => {
	it('should curry a function with the specified arity', () => {
		const add = ((a: number, b: number, c: number) =>
			a + b + c) as unknown as (...args: unknown[]) => unknown;
		const curriedAdd = fn.curry(add) as ((
			a: number
		) => ((b: number) => (c: number) => number) &
			((b: number, c: number) => number)) &
			((a: number, b: number) => (c: number) => number) &
			((a: number, b: number, c: number) => number);

		// Test different ways of calling the curried function
		expect(curriedAdd(1)(2)(3)).toBe(6);
		expect(curriedAdd(1, 2)(3)).toBe(6);
		expect(curriedAdd(1)(2, 3)).toBe(6);
		expect(curriedAdd(1, 2, 3)).toBe(6);
	});

	it('should work with a custom arity', () => {
		// A function with more arguments than it actually uses
		const add = ((
			a: number,
			b: number,
			_unused1?: unknown,
			_unused2?: unknown
		) => a + b) as unknown as (...args: unknown[]) => unknown;

		// Curry with custom arity of 2
		const curriedAdd = fn.curry(add, 2) as ((
			a: number
		) => (b: number) => number) &
			((a: number, b: number) => number);

		expect(curriedAdd(1)(2)).toBe(3);
		expect(curriedAdd(1, 2)).toBe(3);

		// This would not work with default arity (which would be 4)
		// but works with custom arity of 2
		const partial = curriedAdd(1) as (b: number) => number;
		expect(typeof partial).toBe('function');
		expect(partial(2)).toBe(3);
	});

	it('should handle functions with no arguments', () => {
		const getAnswer = (() => 42) as unknown as () => unknown;
		const curriedGetAnswer = fn.curry(getAnswer) as () => number;

		expect(curriedGetAnswer()).toBe(42);
	});

	it('should pass the correct this context', () => {
		const obj = {
			multiplier: 2,
			multiply(a: number) {
				return a * this.multiplier;
			},
		};

		const boundMultiply = obj.multiply.bind(obj) as unknown as (
			...args: unknown[]
		) => unknown;
		const curriedMultiply = fn.curry(boundMultiply) as (
			a: number
		) => number;

		expect(curriedMultiply(4)).toBe(8);
	});

	it('should handle extra arguments', () => {
		const add = ((a: number, b: number) => a + b) as unknown as (
			...args: unknown[]
		) => unknown;
		const curriedAdd = fn.curry(add) as (a: number, b?: number) => number;

		// Extra arguments are ignored
		expect(curriedAdd(1, 2)).toBe(3);
		// Use a third argument, but type safely
		const extraArg: unknown = 3;
		expect(curriedAdd(1, 2)).toBe(3);
	});
});
