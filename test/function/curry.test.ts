// test/function/curry.test.ts
import { fn } from '../../src';

// Simplified approach for curry testing
describe('fn.curry', () => {
	it('should curry a function with the specified arity', () => {
		const add = (a: number, b: number, c: number) => a + b + c;
		// Use a simpler approach without relying on complex TypeScript types
		const curriedAdd = fn.curry(add);

		// Test different ways of calling the curried function
		expect(curriedAdd(1)(2)(3)).toBe(6);
		expect(curriedAdd(1, 2)(3)).toBe(6);
		expect(curriedAdd(1)(2, 3)).toBe(6);
		expect(curriedAdd(1, 2, 3)).toBe(6);
	});

	it('should work with a custom arity', () => {
		// A function with more arguments than it actually uses
		const add = (
			a: number,
			b: number,
			_unused1?: unknown,
			_unused2?: unknown
		) => a + b;

		// Curry with custom arity of 2
		const curriedAdd = fn.curry(add, 2);

		expect(curriedAdd(1)(2)).toBe(3);
		expect(curriedAdd(1, 2)).toBe(3);

		// This would not work with default arity (which would be 4)
		// but works with custom arity of 2
		const partial = curriedAdd(1);
		expect(typeof partial).toBe('function');
		expect(partial(2)).toBe(3);
	});

	it('should handle functions with no arguments', () => {
		const getAnswer = () => 42;
		const curriedGetAnswer = fn.curry(getAnswer);

		expect(curriedGetAnswer()).toBe(42);
	});

	it('should pass the correct this context', () => {
		const obj = {
			multiplier: 2,
			multiply(a: number) {
				return a * this.multiplier;
			},
		};

		const boundMultiply = obj.multiply.bind(obj);
		const curriedMultiply = fn.curry(boundMultiply);

		expect(curriedMultiply(4)).toBe(8);
	});

	it('should handle extra arguments', () => {
		const add = (a: number, b: number) => a + b;
		const curriedAdd = fn.curry(add);

		// Extra arguments are ignored
		expect(curriedAdd(1, 2, 3)).toBe(3);
	});
});
