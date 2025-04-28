// test/types/jest.d.ts
import type { MockInstance } from 'jest-mock';

/**
 * Type definitions to enhance Jest compatibility with TypeScript
 */
declare namespace jest {
	// Extend the Jest mocking functions
	interface Mock<T = unknown, Y extends unknown[] = unknown[]>
		extends MockInstance<T, Y> {
		mockClear(): this;
		mockReset(): this;
		mockRestore(): void;
		mockImplementation(fn: (...args: Y) => T): this;
		mockImplementationOnce(fn: (...args: Y) => T): this;
		mockName(name: string): this;
		mockReturnThis(): this;
		mockReturnValue(value: T): this;
		mockReturnValueOnce(value: T): this;
		mockResolvedValue(value: T extends Promise<infer U> ? U : T): this;
		mockResolvedValueOnce(value: T extends Promise<infer U> ? U : T): this;
		mockRejectedValue(value: unknown): this;
		mockRejectedValueOnce(value: unknown): this;
	}

	// Properly type the jest.fn() function
	interface JestMockFn {
		<T = unknown, Y extends unknown[] = unknown[]>(): Mock<T, Y>;
		<T = unknown, Y extends unknown[] = unknown[]>(
			implementation?: (...args: Y) => T
		): Mock<T, Y>;
	}
}

// Update the global declaration to include our extended types
declare global {
	namespace jest {
		const fn: jest.JestMockFn;
	}
}
