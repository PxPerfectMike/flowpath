// src/async/timeout.ts
import { requireRange, TimeoutError, handleError } from '../errors';

/**
 * Creates a promise that resolves with the result of a function or rejects after a timeout
 * @param fn Function to execute
 * @param ms Timeout in milliseconds
 * @throws {InvalidArgumentError} If ms is not a positive number
 * @throws {TimeoutError} If the function execution exceeds the timeout
 */
export function timeout<T>(fn: () => Promise<T> | T, ms: number): Promise<T> {
	// Validate input
	requireRange(ms, 0, Number.POSITIVE_INFINITY, 'ms');

	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(new TimeoutError(`Timeout of ${ms}ms exceeded`, ms));
		}, ms);

		Promise.resolve(fn())
			.then((result) => {
				clearTimeout(timeoutId);
				resolve(result);
			})
			.catch((error) => {
				clearTimeout(timeoutId);
				reject(handleError(error, 'Function execution failed'));
			});
	});
}
