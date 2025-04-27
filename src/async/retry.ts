// src/async/retry.ts
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

	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= attempts; attempt++) {
		try {
			return await fn(attempt);
		} catch (error) {
			lastError =
				error instanceof Error ? error : new Error(String(error));

			if (attempt < attempts && retryIf(lastError)) {
				if (onRetry) {
					onRetry(lastError, attempt);
				}

				const waitTime = exponential ? delay * 2 ** attempt : delay;
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			} else {
				break;
			}
		}
	}

	throw lastError || new Error('All retry attempts failed');
}
