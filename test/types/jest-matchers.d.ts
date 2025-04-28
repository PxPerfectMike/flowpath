// test/types/jest-matchers.d.ts

// Import all custom error types as types only
import type {
	FlowPathError,
	InvalidArgumentError,
	InvalidOperationError,
	TimeoutError,
	RetryError,
} from '../../src/errors';

/**
 * Proper interface for error constructors to work with Jest's typings
 */
interface CustomErrorConstructor {
	new (...args: unknown[]): Error;
}

/**
 * Generic type for any class constructor
 */
interface Constructable<T = unknown> {
	new (...args: unknown[]): T;
}

// This makes TypeScript recognize our custom error classes with Jest expect().toThrow()
declare global {
	namespace jest {
		interface Matchers<R, T = unknown> {
			// Add overloads specifically for our custom error types
			toThrow(expected?: Error | string | RegExp): R;
			toThrow(expected?: typeof FlowPathError): R;
			toThrow(expected?: typeof InvalidArgumentError): R;
			toThrow(expected?: typeof InvalidOperationError): R;
			toThrow(expected?: typeof TimeoutError): R;
			toThrow(expected?: typeof RetryError): R;
			toThrow(expected?: CustomErrorConstructor): R;

			// Same overloads for toThrowError
			toThrowError(expected?: Error | string | RegExp): R;
			toThrowError(expected?: typeof FlowPathError): R;
			toThrowError(expected?: typeof InvalidArgumentError): R;
			toThrowError(expected?: typeof InvalidOperationError): R;
			toThrowError(expected?: typeof TimeoutError): R;
			toThrowError(expected?: typeof RetryError): R;
			toThrowError(expected?: CustomErrorConstructor): R;
		}
	}
}
