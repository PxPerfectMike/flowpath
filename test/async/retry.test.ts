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
		// The correct way to type a Jest mock function in TypeScript
		const fn = jest.fn().mockImplementation(async () => {
			return Promise.resolve('success');
		});

		// Fail twice, then succeed
		fn.mockRejectedValueOnce(
			new Error('First failure')
		).mockRejectedValueOnce(new Error('Second failure'));
		// The third call will use the implementation above

		const promise = async.retry(fn, {
			attempts: 3,
			delay: 100,
		});

		// Fast-forward time to get past all retries
		jest.advanceTimersByTime(300);

		const result = await promise;

		expect(result).toBe('success');
		expect(fn).toHaveBeenCalledTimes(3);
	});

	it('should fail after all retries are exhausted', async () => {
		const error = new Error('Persistent failure');
		const fn = jest.fn().mockRejectedValue(error);

		const promise = async.retry(fn, {
			attempts: 3,
			delay: 100,
		});

		// Fast-forward time to get past all retries
		jest.advanceTimersByTime(300);

		await expect(promise).rejects.toThrow('Persistent failure');
		expect(fn).toHaveBeenCalledTimes(4); // Initial attempt + 3 retries
	});

	it('should use exponential backoff when specified', async () => {
		// Define the mock function properly
		const fn = jest
			.fn()
			.mockRejectedValueOnce(new Error('First failure'))
			.mockRejectedValueOnce(new Error('Second failure'))
			.mockRejectedValueOnce(new Error('Third failure'))
			.mockResolvedValueOnce('success');

		const promise = async.retry(fn, {
			attempts: 3,
			delay: 100,
			exponential: true,
		});

		// Initial attempt happens immediately
		expect(fn).toHaveBeenCalledTimes(1);

		// First retry should happen after 100ms
		jest.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(2);

		// Second retry should happen after 200ms (2^1 * 100)
		jest.advanceTimersByTime(200);
		expect(fn).toHaveBeenCalledTimes(3);

		// Third retry should happen after 400ms (2^2 * 100)
		jest.advanceTimersByTime(400);
		expect(fn).toHaveBeenCalledTimes(4);

		const result = await promise;
		expect(result).toBe('success');
	});

	it('should call onRetry handler for each retry', async () => {
		// Properly typed mock functions
		const fn = jest
			.fn()
			.mockRejectedValueOnce(new Error('First failure'))
			.mockRejectedValueOnce(new Error('Second failure'))
			.mockResolvedValueOnce('success');

		const onRetry = jest.fn();

		const promise = async.retry(fn, {
			attempts: 3,
			delay: 100,
			onRetry,
		});

		// Fast-forward time to get past all retries
		jest.advanceTimersByTime(300);

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
	});

	it('should respect the retryIf condition', async () => {
		const retryableError = new Error('Retryable');
		const nonRetryableError = new Error('Non-retryable');

		// First error is retryable, second is not
		const fn = jest
			.fn()
			.mockRejectedValueOnce(retryableError)
			.mockRejectedValueOnce(nonRetryableError)
			.mockResolvedValueOnce('success');

		const promise = async.retry(fn, {
			attempts: 3,
			delay: 100,
			retryIf: (error: Error) => error.message === 'Retryable',
		});

		// Fast-forward time to get past the first retry
		jest.advanceTimersByTime(100);

		await expect(promise).rejects.toThrow('Non-retryable');
		expect(fn).toHaveBeenCalledTimes(2); // Initial attempt + 1 retry
	});
});
