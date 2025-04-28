// test/async/retry.test.ts
import { async } from '../../src';
import type { RetryOptions } from '../../src/async/retry';

// Define a custom error type for our tests
class TestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TestError';
		// Fix the prototype chain for instanceof checks
		Object.setPrototypeOf(this, TestError.prototype);
	}
}

// Using real timers for reliable tests
describe('async.retry', () => {
	beforeEach(() => {
		jest.useRealTimers();
	});

	it('should retry a function until it succeeds', async () => {
		// Create a counter to track attempts
		let attempts = 0;

		// Define the function to retry
		const testFn = async (): Promise<string> => {
			attempts++;
			if (attempts <= 2) {
				throw new TestError(`Failure ${attempts}`);
			}
			return 'success';
		};

		// Set up retry options with a small delay for testing
		const options: RetryOptions = {
			attempts: 3,
			delay: 10, // Short delay for faster tests
		};

		// Execute the retry function
		const result = await async.retry(testFn, options);

		// Verify the function succeeded after retries
		expect(result).toBe('success');
		expect(attempts).toBe(3);
	});

	it('should fail after all retries are exhausted', async () => {
		// Define a function that always fails
		const testFn = async (): Promise<string> => {
			throw new TestError('Persistent failure');
		};

		// Set up retry options
		const options: RetryOptions = {
			attempts: 2,
			delay: 10,
		};

		// Execute and expect failure
		let errorMessage = '';
		try {
			await async.retry(testFn, options);
		} catch (e) {
			if (e instanceof Error) {
				errorMessage = e.message;
			}
		}

		// Verify the error message
		expect(errorMessage).toContain('All retry attempts failed');
	});

	it('should use exponential backoff when specified', async () => {
		// Track timestamps for each call
		const timestamps: number[] = [];

		// Define a function that always fails but records its call time
		const testFn = async (): Promise<string> => {
			timestamps.push(Date.now());
			throw new TestError('Failure');
		};

		// Set up retry options with exponential backoff
		const options: RetryOptions = {
			attempts: 2,
			delay: 50,
			exponential: true,
		};

		// Execute and expect failure
		try {
			await async.retry(testFn, options);
		} catch (e) {
			// Expected to fail
		}

		// Verify three calls were made (initial + 2 retries)
		expect(timestamps.length).toBe(3);

		// Calculate intervals between calls
		const interval1 = timestamps[1] - timestamps[0];
		const interval2 = timestamps[2] - timestamps[1];

		// First interval should be around the base delay
		expect(interval1).toBeGreaterThanOrEqual(45);

		// Second interval should increase due to exponential backoff
		expect(interval2).toBeGreaterThanOrEqual(interval1 * 1.5);
	});

	it('should call onRetry handler for each retry', async () => {
		// Create a mock onRetry function with type definition
		const onRetry = jest.fn((error: Error, attempt: number) => {
			// This function body is intentionally empty - just for type checking
		});

		// Define a function that always fails
		const testFn = async (): Promise<string> => {
			throw new TestError('Test failure');
		};

		// Set up retry options with the onRetry handler
		const options: RetryOptions = {
			attempts: 2,
			delay: 10,
			onRetry,
		};

		// Execute and expect failure
		try {
			await async.retry(testFn, options);
		} catch (e) {
			// Expected to fail
		}

		// Verify onRetry was called for each retry
		expect(onRetry).toHaveBeenCalledTimes(2);

		// Type-safe way to check mock calls
		const firstCall = onRetry.mock.calls[0];
		const secondCall = onRetry.mock.calls[1];

		if (firstCall && firstCall.length >= 2) {
			expect(firstCall[0]).toBeInstanceOf(Error);
			expect(firstCall[0].message).toBe('Test failure');
			expect(firstCall[1]).toBe(0);
		}

		if (secondCall && secondCall.length >= 2) {
			expect(secondCall[0]).toBeInstanceOf(Error);
			expect(secondCall[0].message).toBe('Test failure');
			expect(secondCall[1]).toBe(1);
		}
	});

	it('should respect the retryIf condition', async () => {
		// Track the number of attempts
		let attempts = 0;

		// Define a function that fails with different errors
		const testFn = async (): Promise<string> => {
			attempts++;
			if (attempts === 1) {
				throw new TestError('Retryable');
			}
			throw new TestError('Non-retryable');
		};

		// Set up retry options with a condition
		const options: RetryOptions = {
			attempts: 2,
			delay: 10,
			retryIf: (error: Error) => error.message === 'Retryable',
		};

		// Execute and expect failure
		let errorMessage = '';
		try {
			await async.retry(testFn, options);
		} catch (e) {
			if (e instanceof Error) {
				errorMessage = e.message;
			}
		}

		// Verify it failed with the non-retryable error
		expect(errorMessage).toBe('Non-retryable');
		expect(attempts).toBe(2);
	});
});
