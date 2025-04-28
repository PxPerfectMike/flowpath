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

	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= attempts; attempt++) {
		try {
			return await fn(attempt);
		} catch (error) {
			lastError = handleError(error, 'Retry operation failed');

			if (attempt < attempts && retryIf(lastError)) {
				if (onRetry) {
					try {
						onRetry(lastError, attempt);
					} catch (callbackError) {
						// Ignore errors in the onRetry callback
						console.error(
							'Error in retry callback:',
							callbackError
						);
					}
				}

				const waitTime = exponential ? delay * 2 ** attempt : delay;
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			} else {
				break;
			}
		}
	}

	throw new RetryError('All retry attempts failed', attempts, lastError);
}
