// src/async/retry.ts
import { handleError, requireRange, RetryError } from '../errors';

export interface RetryOptions {
	/**
	 * Number of retry attempts
	 * @default 3
	 */
	attempts?: number;

	/**
	 * Delay between retries in milliseconds
	 * @default 1000
	 */
	delay?: number;

	/**
	 * Whether to use exponential backoff
	 * @default false
	 */
	exponential?: boolean;

	/**
	 * Retry condition function
	 * @default Always retry on error
	 */
	retryIf?: (error: Error) => boolean;

	/**
	 * Callback for each retry
	 */
	onRetry?: (error: Error, attempt: number) => void;
}

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param options Retry options
 * @throws {InvalidArgumentError} If retry options are invalid
 * @throws {RetryError} If all retry attempts failed
 */
export async function retry<T>(
	fn: (attempt: number) => Promise<T> | T,
	options: RetryOptions = {}
): Promise<T> {
	const {
		attempts = 3,
		delay = 1000,
		exponential = false,
		retryIf = () => true,
		onRetry,
	} = options;

	// Validate options
	requireRange(attempts, 0, Number.POSITIVE_INFINITY, 'attempts');
	requireRange(delay, 0, Number.POSITIVE_INFINITY, 'delay');

	// This is the simplest implementation - a recursive function that keeps track
	// of the current attempt
	async function attemptWithRetry(currentAttempt: number): Promise<T> {
		try {
			return await Promise.resolve(fn(currentAttempt));
		} catch (error) {
			const handledError = handleError(error, 'Retry operation failed');

			// Check if we should retry
			if (currentAttempt < attempts && retryIf(handledError)) {
				// Call onRetry if provided
				if (onRetry) {
					try {
						onRetry(handledError, currentAttempt);
					} catch (callbackError) {
						// Ignore errors in onRetry callback
						console.error(
							'Error in retry callback:',
							callbackError
						);
					}
				}

				// Calculate delay
				const waitTime = exponential
					? delay * 2 ** currentAttempt
					: delay;

				// Wait before retrying
				await new Promise((resolve) => setTimeout(resolve, waitTime));

				// Try again with an incremented attempt counter
				return attemptWithRetry(currentAttempt + 1);
			}

			// No more retries, throw the error
			if (currentAttempt === attempts) {
				throw new RetryError(
					'All retry attempts failed',
					attempts,
					handledError
				);
			}

			throw handledError;
		}
	}

	// Start with attempt 0
	return attemptWithRetry(0);
}
