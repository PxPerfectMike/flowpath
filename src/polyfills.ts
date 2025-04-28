// src/polyfills.ts
/**
 * Polyfills for browser compatibility.
 * Import this file at the entry point of your application to ensure
 * that all required polyfills are applied.
 */

// Array.from polyfill
if (typeof Array.from !== 'function') {
	Array.from = <T>(
		arrayLikeOrIterable: ArrayLike<T> | Iterable<T>,
		mapFn?: (v: T, k: number) => T
	): T[] => {
		// Check if iterable
		if (
			arrayLikeOrIterable &&
			typeof Symbol !== 'undefined' &&
			Symbol.iterator &&
			Symbol.iterator in Object(arrayLikeOrIterable)
		) {
			try {
				const result: T[] = [];
				const iterator = (arrayLikeOrIterable as Iterable<T>)[
					Symbol.iterator
				]();
				let item = iterator.next();
				let index = 0;

				while (!item.done) {
					result.push(mapFn ? mapFn(item.value, index) : item.value);
					item = iterator.next();
					index++;
				}

				return result;
			} catch (e) {
				// Fall through to array-like handling
			}
		}

		// Otherwise, handle as array-like
		const arrayLike = arrayLikeOrIterable as ArrayLike<T>;
		const result: T[] = [];
		const length = arrayLike.length || 0;

		for (let i = 0; i < length; i++) {
			result.push(mapFn ? mapFn(arrayLike[i], i) : arrayLike[i]);
		}

		return result;
	};
}

// Object.assign polyfill
if (typeof Object.assign !== 'function') {
	Object.assign = <T extends object>(target: T, ...sources: object[]): T => {
		if (target === null || target === undefined) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		const to = Object(target) as Record<string | symbol, unknown>;

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
			if (source !== null && source !== undefined) {
				const sourceObj = Object(source) as Record<
					string | symbol,
					unknown
				>;

				// Use hasOwnProperty from Object prototype to avoid issues with objects
				// that might have overridden hasOwnProperty
				for (const key in sourceObj) {
					if (Object.prototype.hasOwnProperty.call(sourceObj, key)) {
						to[key] = sourceObj[key];
					}
				}
			}
		}

		return target;
	};
}

// String.prototype.padStart polyfill
if (typeof String.prototype.padStart !== 'function') {
	String.prototype.padStart = function (
		maxLength: number,
		fillString = ' '
	): string {
		const str = String(this);
		if (str.length >= maxLength) {
			return str;
		}

		const filler = String(fillString);
		if (filler === '') {
			return str;
		}

		const padding = maxLength - str.length;

		// Create the padding string by repeating the filler
		let paddingStr = filler;
		while (paddingStr.length < padding) {
			paddingStr += filler;
		}

		// Truncate the padding string to the exact length needed
		return paddingStr.substring(0, padding) + str;
	};
}

// String.prototype.padEnd polyfill
if (typeof String.prototype.padEnd !== 'function') {
	String.prototype.padEnd = function (
		maxLength: number,
		fillString = ' '
	): string {
		const str = String(this);
		if (str.length >= maxLength) {
			return str;
		}

		const filler = String(fillString);
		if (filler === '') {
			return str;
		}

		const padding = maxLength - str.length;

		// Create the padding string by repeating the filler
		let paddingStr = filler;
		while (paddingStr.length < padding) {
			paddingStr += filler;
		}

		// Truncate the padding string to the exact length needed
		return str + paddingStr.substring(0, padding);
	};
}

// String.prototype.repeat polyfill
if (typeof String.prototype.repeat !== 'function') {
	String.prototype.repeat = function (count: number): string {
		if (this == null) {
			throw new TypeError(
				'String.prototype.repeat called on null or undefined'
			);
		}

		const stringValue = String(this);
		const n = Math.floor(count);

		if (n < 0 || n === Number.POSITIVE_INFINITY) {
			throw new RangeError('Invalid count value');
		}

		if (n === 0) {
			return '';
		}

		let result = '';
		let currentValue = stringValue;
		let remainingCount = n;

		while (remainingCount > 0) {
			if (remainingCount & 1) {
				result += currentValue;
			}

			remainingCount >>= 1;
			if (remainingCount > 0) {
				currentValue += currentValue;
			}
		}

		return result;
	};
}

// Promise polyfill - Note: For a real application, consider using a proper
// Promise polyfill library like es6-promise or core-js
if (typeof Promise === 'undefined') {
	console.warn(
		'Promise is not supported in this environment. ' +
			'Please include a Promise polyfill library like es6-promise or core-js.'
	);
}

// Map polyfill - Note: For a real application, consider using a proper
// Map polyfill from a library like core-js
if (typeof Map === 'undefined') {
	console.warn(
		'Map is not supported in this environment. ' +
			'Please include a Map polyfill library like core-js.'
	);
}

// Set polyfill - Note: For a real application, consider using a proper
// Set polyfill from a library like core-js
if (typeof Set === 'undefined') {
	console.warn(
		'Set is not supported in this environment. ' +
			'Please include a Set polyfill library like core-js.'
	);
}

// Symbol polyfill - Note: For a real application, consider using a proper
// Symbol polyfill from a library like core-js
if (typeof Symbol === 'undefined') {
	console.warn(
		'Symbol is not supported in this environment. ' +
			'Please include a Symbol polyfill library like core-js.'
	);
}

// Provide a warning and setup information in the console
console.info(
	'FlowPath: Polyfills have been applied for browser compatibility. ' +
		'For better performance in production, consider using a dedicated ' +
		'polyfill service or library like core-js.'
);
