// test/types.d.ts

// This adds proper TypeScript definitions for Jest test callbacks
declare namespace jest {
	interface It {
		(name: string, fn: () => void | Promise<void>, timeout?: number): void;
		(
			name: string,
			fn: (done: jest.DoneCallback) => void,
			timeout?: number
		): void;
	}

	interface Describe {
		(name: string, fn: () => void): void;
	}

	interface DoneCallback {
		(...args: any[]): any;
		fail(error?: string | { message: string }): any;
	}
}

// Extend global types
declare global {
	const it: jest.It;
	const test: jest.It;
	const describe: jest.Describe;
	const beforeEach: (fn: () => void | Promise<void>) => void;
	const afterEach: (fn: () => void | Promise<void>) => void;

	namespace jest {
		function fn<T extends (...args: any[]) => any>(
			implementation?: (...args: Parameters<T>) => ReturnType<T>
		): jest.Mock<ReturnType<T>, Parameters<T>>;
	}
}
