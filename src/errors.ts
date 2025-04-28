// src/errors.ts

/**
 * Base error class for FlowPath
 */
export class FlowPathError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'FlowPathError';
		// Ensure proper prototype chain for instanceof checks in transpiled code
		Object.setPrototypeOf(this, FlowPathError.prototype);
	}
}

/**
 * Error thrown when an invalid argument is provided
 */
export class InvalidArgumentError extends FlowPathError {
	constructor(
		message: string,
		public readonly argumentName?: string,
		public readonly providedValue?: unknown
	) {
		super(message);
		this.name = 'InvalidArgumentError';
		Object.setPrototypeOf(this, InvalidArgumentError.prototype);
	}
}

/**
 * Error thrown when an operation is invalid
 */
export class InvalidOperationError extends FlowPathError {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidOperationError';
		Object.setPrototypeOf(this, InvalidOperationError.prototype);
	}
}

/**
 * Error thrown when a timeout occurs
 */
export class TimeoutError extends FlowPathError {
	constructor(message: string, public readonly timeoutMs: number) {
		super(message);
		this.name = 'TimeoutError';
		Object.setPrototypeOf(this, TimeoutError.prototype);
	}
}

/**
 * Error thrown when a number of retry attempts is exhausted
 */
export class RetryError extends FlowPathError {
	constructor(
		message: string,
		public readonly attempts: number,
		public readonly lastError?: Error
	) {
		super(
			`${message}${
				lastError ? `: ${lastError.message}` : ''
			} after ${attempts} attempts`
		);
		this.name = 'RetryError';
		Object.setPrototypeOf(this, RetryError.prototype);
	}
}

/**
 * Validates that a value is not null or undefined
 * @param value The value to check
 * @param name The name of the parameter (for error messages)
 * @throws {InvalidArgumentError} If the value is null or undefined
 */
export function requireDefined<T>(
	value: T | null | undefined,
	name: string
): T {
	if (value === null || value === undefined) {
		throw new InvalidArgumentError(
			`Parameter '${name}' must not be null or undefined`,
			name,
			value
		);
	}
	return value;
}

/**
 * Validates that a value satisfies a condition
 * @param value The value to check
 * @param condition The condition to satisfy
 * @param message The error message if the condition fails
 * @param name The name of the parameter (for error messages)
 * @throws {InvalidArgumentError} If the condition is not satisfied
 */
export function requireCondition<T>(
	value: T,
	condition: (value: T) => boolean,
	message: string,
	name?: string
): T {
	if (!condition(value)) {
		throw new InvalidArgumentError(message, name, value);
	}
	return value;
}

/**
 * Validates that a number is within a range
 * @param value The number to check
 * @param min The minimum allowed value (inclusive)
 * @param max The maximum allowed value (inclusive)
 * @param name The name of the parameter (for error messages)
 * @throws {InvalidArgumentError} If the value is outside the range
 */
export function requireRange(
	value: number,
	min: number,
	max: number,
	name: string
): number {
	// Check if value is not a number before comparing
	if (
		typeof value !== 'number' ||
		Number.isNaN(value) ||
		value < min ||
		value > max
	) {
		throw new InvalidArgumentError(
			`Parameter '${name}' must be a number between ${min} and ${max}`,
			name,
			value
		);
	}
	return value;
}

/**
 * Type map for valid JavaScript types
 */
export type TypeMap = {
	string: string;
	number: number;
	boolean: boolean;
	object: object;
	function: (...args: unknown[]) => unknown;
	undefined: undefined;
	symbol: symbol;
	bigint: bigint;
};

/**
 * Type guard functions for each expected typeof value
 */
const typeGuards: Record<keyof TypeMap, (value: unknown) => boolean> = {
	string: (value): value is string => typeof value === 'string',
	number: (value): value is number => typeof value === 'number',
	boolean: (value): value is boolean => typeof value === 'boolean',
	object: (value): value is object =>
		typeof value === 'object' && value !== null,
	function: (value): value is (...args: unknown[]) => unknown =>
		typeof value === 'function',
	undefined: (value): value is undefined => typeof value === 'undefined',
	symbol: (value): value is symbol => typeof value === 'symbol',
	bigint: (value): value is bigint => typeof value === 'bigint',
};

/**
 * Validates that a value is of a specific type
 * @param value The value to check
 * @param type The expected type
 * @param name The name of the parameter (for error messages)
 * @throws {InvalidArgumentError} If the value is not of the expected type
 */
export function requireType<K extends keyof TypeMap>(
	value: unknown,
	type: K,
	name: string
): TypeMap[K] {
	// Use our pre-defined type guards instead of a direct typeof comparison
	if (!typeGuards[type](value)) {
		throw new InvalidArgumentError(
			`Parameter '${name}' must be of type ${type}`,
			name,
			value
		);
	}
	return value as TypeMap[K];
}

/**
 * Validates that an array has elements
 * @param array The array to check
 * @param name The name of the parameter (for error messages)
 * @throws {InvalidArgumentError} If the array is empty
 */
export function requireNonEmpty<T>(array: T[], name: string): T[] {
	if (!Array.isArray(array) || array.length === 0) {
		throw new InvalidArgumentError(
			`Parameter '${name}' must be a non-empty array`,
			name,
			array
		);
	}
	return array;
}

/**
 * Standard way to handle unexpected errors
 * @param error The caught error
 * @param defaultMessage Default message if the error is not an Error instance
 */
export function handleError(error: unknown, defaultMessage: string): Error {
	if (error instanceof Error) {
		return error;
	}

	// Fix the typeof check by using a string literal for the comparison
	const errorType = typeof error;
	if (errorType === 'string') {
		return new FlowPathError(error as string);
	}

	return new FlowPathError(defaultMessage);
}
