// src/async/batch.ts
import { chunk } from '../array/chunk';

export interface BatchOptions<T, R> {
	/**
	 * Function to process each item
	 */
	process: (item: T, index: number) => Promise<R>;

	/**
	 * Number of items to process concurrently
	 * @default Infinity
	 */
	concurrency?: number;

	/**
	 * Number of retries for failed items
	 * @default 0
	 */
	retries?: number;

	/**
	 * Delay between retries in milliseconds
	 * @default 1000
	 */
	retryDelay?: number;

	/**
	 * Whether to use exponential backoff for retries
	 * @default false
	 */
	exponentialBackoff?: boolean;

	/**
	 * Timeout for each item in milliseconds
	 * @default undefined (no timeout)
	 */
	timeout?: number;

	/**
	 * Progress callback
	 */
	onProgress?: (progress: {
		completed: number;
		total: number;
		result?: R;
		error?: Error;
	}) => void;
}

/**
 * Processes items in batches with controlled concurrency and advanced options
 * @param items Items to process
 * @param options Batch processing options
 */
export async function batch<T, R>(
	items: T[],
	options: BatchOptions<T, R>
): Promise<R[]> {
	const {
		process,
		concurrency = Number.POSITIVE_INFINITY,
		retries = 0,
		retryDelay = 1000,
		exponentialBackoff = false,
		timeout,
		onProgress,
	} = options;

	const results: R[] = new Array(items.length);
	const effectiveConcurrency = Math.min(items.length, concurrency);

	// If unlimited concurrency, process all at once
	if (effectiveConcurrency === Number.POSITIVE_INFINITY) {
		return Promise.all(
			items.map(async (item, index) => {
				const result = await processWithRetry(item, index);
				results[index] = result;
				return result;
			})
		);
	}

	// Process in batches with limited concurrency
	const batches = chunk(items, effectiveConcurrency);
	let completedCount = 0;

	for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
		const batch = batches[batchIndex];
		const batchResults = await Promise.all(
			batch.map(async (item, index) => {
				const originalIndex = batchIndex * effectiveConcurrency + index;
				try {
					const result = await processWithRetry(item, originalIndex);
					results[originalIndex] = result;

					completedCount++;
					if (onProgress) {
						onProgress({
							completed: completedCount,
							total: items.length,
							result,
						});
					}

					return result;
				} catch (error) {
					completedCount++;
					if (onProgress) {
						onProgress({
							completed: completedCount,
							total: items.length,
							error:
								error instanceof Error
									? error
									: new Error(String(error)),
						});
					}
					throw error;
				}
			})
		);
	}

	return results;

	async function processWithRetry(item: T, index: number): Promise<R> {
		let lastError: Error | undefined;

		for (let attempt = 0; attempt <= retries; attempt++) {
			try {
				const executor = process(item, index);

				// Apply timeout if specified
				if (timeout) {
					return await Promise.race([
						executor,
						new Promise<never>((_, reject) => {
							setTimeout(
								() =>
									reject(
										new Error(
											`Timeout of ${timeout}ms exceeded`
										)
									),
								timeout
							);
						}),
					]);
				}

				return await executor;
			} catch (error) {
				lastError =
					error instanceof Error ? error : new Error(String(error));

				if (attempt < retries) {
					const delay = exponentialBackoff
						? retryDelay * 2 ** attempt
						: retryDelay;

					await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}
		}

		throw lastError || new Error('Processing failed');
	}
}
