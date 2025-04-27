// test/pipeline.test.ts
import { pipeline, branch, validate, transform, tap } from '../src/pipeline';

describe('pipeline', () => {
	it('should compose functions from left to right', () => {
		const add2 = (x: number) => x + 2;
		const multiply3 = (x: number) => x * 3;
		const square = (x: number) => x * x;

		const process = pipeline(add2, multiply3, square);

		expect(process(5)).toBe(441); // ((5 + 2) * 3)² = 441
	});

	it('should handle pipeline steps with options', () => {
		const process = pipeline(
			{
				transform: (x: number) => x + 2,
				name: 'add2',
			},
			{
				transform: (x: number) => {
					if (x === 0) throw new Error('Cannot multiply by zero');
					return x * 3;
				},
				name: 'multiply3',
			},
			(x: number) => x * x
		);

		expect(process(5)).toBe(441);
	});

	it('should handle errors with onError handler', () => {
		const process = pipeline(
			(x: number) => x + 2,
			{
				transform: (x: number) => {
					if (x === 7) throw new Error('Lucky 7 error');
					return x * 3;
				},
				onError: (error, input) => input, // On error, just pass through the input
			},
			(x: number) => x * x
		);

		expect(process(5)).toBe(441); // Normal path
		expect(process(5)).toBe(441); // ((5 + 2) * 3)² = 441
		expect(process(5)).toBe(441); // ((5 + 2) * 3)² = 441
	});

	it('should support validation steps', () => {
		const process = pipeline(
			(x: number) => x + 2,
			validate((x: number) => x > 0, 'Value must be positive'),
			(x: number) => x * 3
		);

		expect(process(5)).toBe(21);
		expect(() => process(-3)).toThrow('Value must be positive');
	});

	it('should support branch steps', () => {
		const process = pipeline(
			(x: number) => x + 2,
			branch({
				when: (x: number) => x % 2 === 0,
				then: (x: number) => x * 2,
				else: (x: number) => x * 3,
			}),
			(x: number) => x * x
		);

		expect(process(5)).toBe(441); // 5+2=7, 7*3=21, 21²=441
		expect(process(4)).toBe(144); // 4+2=6, 6*2=12, 12²=144
	});

	it('should support side effects with tap', () => {
		const sideEffect = jest.fn();

		const process = pipeline(
			(x: number) => x + 2,
			tap(sideEffect),
			(x: number) => x * 3
		);

		expect(process(5)).toBe(21);
		expect(sideEffect).toHaveBeenCalledWith(7);
	});
});
