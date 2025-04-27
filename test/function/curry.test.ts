// test/function/curry.test.ts
import { fn } from '../../src';

// Define a curried function type to help with type assertions
type CurriedFunc<T extends (...args: unknown[]) => unknown> = T extends (
	a: infer A,
	...args: infer R extends unknown[]
) => infer U
	? (a: A) => CurriedFunc<(...args: R) => U> | U
	: T;

describe('fn.curry', () => {
	it('should curry a function with the specified arity', (done) => {
		const add = (a: number, b: number, c: number) => a + b + c;
		// Use more specific casting
		const curriedAdd = fn.curry(
			add as unknown as (...args: unknown[]) => unknown
		) as (a: number) => (b: number) => (c: number) => number;

		// Test different ways of calling the curried function
		expect(curriedAdd(1)(2)(3)).toBe(6);
		expect(curriedAdd(1)(2)(3)).toBe(6);
		expect(curriedAdd(1)(2)(3)).toBe(6);
		expect(curriedAdd(1)(2)(3)).toBe(6);
		done();
	});

	it('should work with a custom arity', (done) => {
		// A function with more arguments than it actually uses
		const add = (
			a: number,
			b: number,
			_unused1?: unknown,
			_unused2?: unknown
		) => a + b;

		// Curry with custom arity of 2
		const curriedAdd = fn.curry(
			add as unknown as (...args: unknown[]) => unknown,
			2
		) as ((a: number) => (b: number) => number) &
			((a: number, b: number) => number);

		expect(curriedAdd(1)(2)).toBe(3);
		expect(curriedAdd(1, 2)).toBe(3);

		// This would not work with default arity (which would be 4)
		// but works with custom arity of 2
		const partial = curriedAdd(1);
		expect(typeof partial).toBe('function');
		expect((partial as (b: number) => number)(2)).toBe(3);
		done();
	});

	it('should handle functions with no arguments', (done) => {
		const getAnswer = () => 42;
		const curriedGetAnswer = fn.curry(
			getAnswer as unknown as (...args: unknown[]) => unknown
		) as () => number;

		expect(curriedGetAnswer()).toBe(42);
		done();
	});

	it('should pass the correct this context', (done) => {
		const obj = {
			multiplier: 2,
			multiply(a: number) {
				return a * this.multiplier;
			},
		};

		const boundMultiply = obj.multiply.bind(obj);
		const curriedMultiply = fn.curry(
			boundMultiply as unknown as (...args: unknown[]) => unknown
		) as (a: number) => number;

		expect(curriedMultiply(4)).toBe(8);
		done();
	});

	it('should handle extra arguments', (done) => {
		const add = (a: number, b: number) => a + b;
		const curriedAdd = fn.curry(
			add as unknown as (...args: unknown[]) => unknown
		) as unknown as (a: number, b: number, c?: number) => number;

		// Extra arguments are ignored
		expect(curriedAdd(1, 2, 3)).toBe(3);
		done();
	});
});
