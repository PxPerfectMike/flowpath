// test/errors.test.ts
import {
	FlowPathError,
	InvalidArgumentError,
	InvalidOperationError,
	TimeoutError,
	RetryError,
	requireDefined,
	requireCondition,
	requireRange,
	requireType,
	requireNonEmpty,
	handleError,
} from '../src/errors';

describe('Error classes', () => {
	it('should create FlowPathError with correct properties', () => {
		const error = new FlowPathError('Test error');
		expect(error.name).toBe('FlowPathError');
		expect(error.message).toBe('Test error');
		expect(error instanceof Error).toBe(true);
		expect(error instanceof FlowPathError).toBe(true);
	});

	it('should create InvalidArgumentError with correct properties', () => {
		const error = new InvalidArgumentError('Test error', 'testArg', 123);
		expect(error.name).toBe('InvalidArgumentError');
		expect(error.message).toBe('Test error');
		expect(error.argumentName).toBe('testArg');
		expect(error.providedValue).toBe(123);
		expect(error instanceof FlowPathError).toBe(true);
		expect(error instanceof InvalidArgumentError).toBe(true);
	});

	it('should create InvalidOperationError with correct properties', () => {
		const error = new InvalidOperationError('Test error');
		expect(error.name).toBe('InvalidOperationError');
		expect(error.message).toBe('Test error');
		expect(error instanceof FlowPathError).toBe(true);
		expect(error instanceof InvalidOperationError).toBe(true);
	});

	it('should create TimeoutError with correct properties', () => {
		const error = new TimeoutError('Test error', 1000);
		expect(error.name).toBe('TimeoutError');
		expect(error.message).toBe('Test error');
		expect(error.timeoutMs).toBe(1000);
		expect(error instanceof FlowPathError).toBe(true);
		expect(error instanceof TimeoutError).toBe(true);
	});

	it('should create RetryError with correct properties', () => {
		const lastError = new Error('Last error');
		const error = new RetryError('Test error', 3, lastError);
		expect(error.name).toBe('RetryError');
		expect(error.message).toBe('Test error: Last error after 3 attempts');
		expect(error.attempts).toBe(3);
		expect(error.lastError).toBe(lastError);
		expect(error instanceof FlowPathError).toBe(true);
		expect(error instanceof RetryError).toBe(true);
	});

	it('should create RetryError without lastError', () => {
		const error = new RetryError('Test error', 3);
		expect(error.message).toBe('Test error after 3 attempts');
		expect(error.lastError).toBeUndefined();
	});
});

describe('Validation functions', () => {
	describe('requireDefined', () => {
		it('should return the value if defined', () => {
			expect(requireDefined('test', 'testArg')).toBe('test');
			expect(requireDefined(0, 'testArg')).toBe(0);
			expect(requireDefined(false, 'testArg')).toBe(false);
			expect(requireDefined({}, 'testArg')).toEqual({});
		});

		it('should throw for undefined values', () => {
			expect(() => requireDefined(undefined, 'testArg')).toThrow(
				/must not be null or undefined/
			);
			expect(() => requireDefined(undefined, 'testArg')).toThrow(
				new InvalidArgumentError(
					"Parameter 'testArg' must not be null or undefined",
					'testArg',
					undefined
				)
			);
		});

		it('should throw for null values', () => {
			expect(() => requireDefined(null, 'testArg')).toThrow(
				/must not be null or undefined/
			);
			expect(() => requireDefined(null, 'testArg')).toThrow(
				new InvalidArgumentError(
					"Parameter 'testArg' must not be null or undefined",
					'testArg',
					null
				)
			);
		});
	});

	describe('requireCondition', () => {
		it('should return the value if condition is met', () => {
			expect(
				requireCondition(5, (x) => x > 0, 'Must be positive', 'testArg')
			).toBe(5);
			expect(
				requireCondition(
					'test',
					(x) => x.length > 0,
					'Must not be empty',
					'testArg'
				)
			).toBe('test');
		});

		it('should throw if condition is not met', () => {
			expect(() =>
				requireCondition(
					-5,
					(x) => x > 0,
					'Must be positive',
					'testArg'
				)
			).toThrow('Must be positive');
			expect(() =>
				requireCondition(
					-5,
					(x) => x > 0,
					'Must be positive',
					'testArg'
				)
			).toThrow(
				new InvalidArgumentError('Must be positive', 'testArg', -5)
			);
		});
	});

	describe('requireRange', () => {
		it('should return the value if within range', () => {
			expect(requireRange(5, 0, 10, 'testArg')).toBe(5);
			expect(requireRange(0, 0, 10, 'testArg')).toBe(0);
			expect(requireRange(10, 0, 10, 'testArg')).toBe(10);
		});

		it('should throw if value is below minimum', () => {
			expect(() => requireRange(-1, 0, 10, 'testArg')).toThrow(
				/must be a number between/
			);
			expect(() => requireRange(-1, 0, 10, 'testArg')).toThrow(
				new InvalidArgumentError(
					"Parameter 'testArg' must be a number between 0 and 10",
					'testArg',
					-1
				)
			);
		});

		it('should throw if value is above maximum', () => {
			expect(() => requireRange(11, 0, 10, 'testArg')).toThrow(
				/must be a number between/
			);
			expect(() => requireRange(11, 0, 10, 'testArg')).toThrow(
				new InvalidArgumentError(
					"Parameter 'testArg' must be a number between 0 and 10",
					'testArg',
					11
				)
			);
		});

		it('should throw if value is not a number', () => {
			expect(() =>
				requireRange('5' as unknown as number, 0, 10, 'testArg')
			).toThrow(/must be a number between/);
			expect(() =>
				requireRange('5' as unknown as number, 0, 10, 'testArg')
			).toThrow(
				new InvalidArgumentError(
					"Parameter 'testArg' must be a number between 0 and 10",
					'testArg',
					'5'
				)
			);
		});
	});

	describe('requireType', () => {
		it('should return the value if type matches', () => {
			expect(requireType('test', 'string', 'testArg')).toBe('test');
			expect(requireType(5, 'number', 'testArg')).toBe(5);
			expect(requireType(true, 'boolean', 'testArg')).toBe(true);
			expect(requireType({}, 'object', 'testArg')).toEqual({});
			expect(requireType(() => {}, 'function', 'testArg')).toBeInstanceOf(
				Function
			);
		});

		it('should throw if type does not match', () => {
			expect(() => requireType(5, 'string', 'testArg')).toThrow(
				/must be of type string/
			);
			expect(() => requireType(5, 'string', 'testArg')).toThrow(
				new InvalidArgumentError(
					"Parameter 'testArg' must be of type string",
					'testArg',
					5
				)
			);
		});
	});

	describe('requireNonEmpty', () => {
		it('should return the array if non-empty', () => {
			expect(requireNonEmpty([1, 2, 3], 'testArg')).toEqual([1, 2, 3]);
			expect(requireNonEmpty(['test'], 'testArg')).toEqual(['test']);
		});

		it('should throw if array is empty', () => {
			expect(() => requireNonEmpty([], 'testArg')).toThrow(
				/must be a non-empty array/
			);
			expect(() => requireNonEmpty([], 'testArg')).toThrow(
				new InvalidArgumentError(
					"Parameter 'testArg' must be a non-empty array",
					'testArg',
					[]
				)
			);
		});

		it('should throw if not an array', () => {
			expect(() =>
				requireNonEmpty('test' as unknown as [], 'testArg')
			).toThrow(/must be a non-empty array/);
			expect(() =>
				requireNonEmpty('test' as unknown as [], 'testArg')
			).toThrow(
				new InvalidArgumentError(
					"Parameter 'testArg' must be a non-empty array",
					'testArg',
					'test'
				)
			);
		});
	});

	describe('handleError', () => {
		it('should return the error if it is an Error instance', () => {
			const error = new Error('Test error');
			expect(handleError(error, 'Default message')).toBe(error);
		});

		it('should create a FlowPathError for string errors', () => {
			const error = handleError('Test error', 'Default message');
			expect(error).toBeInstanceOf(FlowPathError);
			expect(error.message).toBe('Test error');
		});

		it('should create a FlowPathError with default message for non-Error, non-string errors', () => {
			const error = handleError(123, 'Default message');
			expect(error).toBeInstanceOf(FlowPathError);
			expect(error.message).toBe('Default message');
		});
	});
});
