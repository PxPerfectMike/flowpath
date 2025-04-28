// test/async/retry.test.ts
import { async } from '../../src';

describe('async.retry', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should retry a function until it succeeds', async () => {
		// Use a properly typed mock function
		const mockFn = jest.fn<Promise<string>, []>();

		// Setup the mock behavior
		mockFn
			.mockRejectedValueOnce(new Error('First failure'))
			.mockRejectedValueOnce(new Error('Second failure'))
			.mockResolvedValue('success');

		const promise = async.retry(mockFn, {
			attempts: 3,
			delay: 100,
		});

		// Advance timers and use flushPromises to ensure promises resolve
		jest.runAllTimers();

		const result = await promise;

		expect(result).toBe('success');
		expect(mockFn).toHaveBeenCalledTimes(3);
	}, 20000);

	it('should fail after all retries are exhausted', async () => {
		const error = new Error('Persistent failure');
		const mockFn = jest.fn<Promise<never>, []>().mockRejectedValue(error);

		const promise = async.retry(mockFn, {
			attempts: 3,
			delay: 100,
		});

		// Run all timers at once instead of incrementally
		jest.runAllTimers();

		await expect(promise).rejects.toThrow('Persistent failure');
		expect(mockFn).toHaveBeenCalledTimes(4); // Initial attempt + 3 retries
	}, 20000);

	it('should use exponential backoff when specified', async () => {
		// Define a properly typed mock function
		const mockFn = jest.fn<Promise<string>, []>();

		mockFn
			.mockRejectedValueOnce(new Error('First failure'))
			.mockRejectedValueOnce(new Error('Second failure'))
			.mockRejectedValueOnce(new Error('Third failure'))
			.mockResolvedValue('success');

		const promise = async.retry(mockFn, {
			attempts: 3,
			delay: 100,
			exponential: true,
		});

		// Initial attempt happens immediately
		expect(mockFn).toHaveBeenCalledTimes(1);

		// Advance timers all at once
		jest.runAllTimers();

		await promise;

		// By now all attempts should have been made
		expect(mockFn).toHaveBeenCalledTimes(4);
	}, 20000);

	it('should call onRetry handler for each retry', async () => {
		// Properly typed mock functions
		const mockFn = jest.fn<Promise<string>, []>();

		mockFn
			.mockRejectedValueOnce(new Error('First failure'))
			.mockRejectedValueOnce(new Error('Second failure'))
			.mockResolvedValue('success');

		const onRetry = jest.fn();

		const promise = async.retry(mockFn, {
			attempts: 3,
			delay: 100,
			onRetry,
		});

		// Run all timers at once
		jest.runAllTimers();

		await promise;

		expect(onRetry).toHaveBeenCalledTimes(2);
		expect(onRetry).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ message: 'First failure' }),
			0
		);
		expect(onRetry).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ message: 'Second failure' }),
			1
		);
	}, 20000);

	it('should respect the retryIf condition', async () => {
		const retryableError = new Error('Retryable');
		const nonRetryableError = new Error('Non-retryable');

		// First error is retryable, second is not
		const mockFn = jest.fn<Promise<string>, []>();

		mockFn
			.mockRejectedValueOnce(retryableError)
			.mockRejectedValueOnce(nonRetryableError)
			.mockResolvedValue('success');

		const promise = async.retry(mockFn, {
			attempts: 3,
			delay: 100,
			retryIf: (error: Error) => error.message === 'Retryable',
		});

		// Run all timers at once
		jest.runAllTimers();

		await expect(promise).rejects.toThrow('Non-retryable');
		expect(mockFn).toHaveBeenCalledTimes(2); // Initial attempt + 1 retry
	}, 20000);
});
