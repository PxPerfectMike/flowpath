// src/async/timeout.ts
/**
 * Creates a promise that resolves with the result of a function or rejects after a timeout
 * @param fn Function to execute
 * @param ms Timeout in milliseconds
 */
export function timeout<T>(fn: () => Promise<T> | T, ms: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(new Error(`Timeout of ${ms}ms exceeded`));
		}, ms);

		Promise.resolve(fn())
			.then((result) => {
				clearTimeout(timeoutId);
				resolve(result);
			})
			.catch((error) => {
				clearTimeout(timeoutId);
				reject(error);
			});
	});
}
