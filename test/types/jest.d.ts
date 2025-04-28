// test/types/jest.d.ts
import { MockInstance } from 'jest-mock';

/**
 * Type definitions to enhance Jest compatibility with TypeScript
 */
declare namespace jest {
	// Extend the Jest mocking functions
	interface Mock<T = any, Y extends any[] = any[]>
		extends Function,
			MockInstance<T, Y> {
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
		mockRejectedValue(value: any): this;
		mockRejectedValueOnce(value: any): this;
	}

	// Properly type the jest.fn() function
	interface JestMockFn {
		<T = any, Y extends any[] = any[]>(): Mock<T, Y>;
		<T = any, Y extends any[] = any[]>(
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

export {};
