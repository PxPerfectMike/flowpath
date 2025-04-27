/**
 * Options for the memo function
 */
export interface MemoOptions<T extends (...args: unknown[]) => unknown> {
	/**
	 * Maximum size of the cache
	 * @default Infinity
	 */
	maxSize?: number;

	/**
	 * Time-to-live in milliseconds
	 * @default Infinity
	 */
	ttl?: number;

	/**
	 * Function to generate cache keys
	 * @default JSON.stringify
	 */
	keyGenerator?: (...args: Parameters<T>) => string;

	/**
	 * Array of parameter indices that should cause cache invalidation when they change
	 * @default [] (no invalidation)
	 */
	invalidateOn?: number[];
}

/**
 * Creates a memoized version of a function with advanced caching options
 * @param fn Function to memoize
 * @param options Memoization options
 */
export function memo<T extends (...args: unknown[]) => unknown>(
	fn: T,
	options: MemoOptions<T> = {}
): T & {
	clear: () => void;
	invalidate: (...args: Parameters<T>) => void;
} {
	const {
		maxSize = Number.POSITIVE_INFINITY,
		ttl = Number.POSITIVE_INFINITY,
		keyGenerator = (...args: Parameters<T>) => JSON.stringify(args),
		invalidateOn = [],
	} = options;

	type CacheEntry = {
		value: ReturnType<T>;
		timestamp: number;
		dependencyKeys: Map<number, string>;
	};

	const cache = new Map<string, CacheEntry>();
	const dependencyCache = new Map<string, Set<string>>();

	function memoized(this: unknown, ...args: Parameters<T>): ReturnType<T> {
		const key = keyGenerator(...args);
		const now = Date.now();

		// Check if the result is in the cache and not expired
		if (cache.has(key)) {
			const entry = cache.get(key);
			if (!entry) {
				throw new Error(`Cache entry for key "${key}" is missing.`);
			}

			// Check TTL
			if (now - entry.timestamp < ttl) {
				// Check if any dependencies have changed
				if (invalidateOn.length > 0) {
					let shouldInvalidate = false;

					for (const index of invalidateOn) {
						const arg = args[index];
						const previousArgKey = entry.dependencyKeys.get(index);
						const currentArgKey = JSON.stringify(arg);

						if (previousArgKey !== currentArgKey) {
							shouldInvalidate = true;
							break;
						}
					}

					if (!shouldInvalidate) {
						return entry.value;
					}
				} else {
					return entry.value;
				}
			}
		}

		// Calculate the result
		const result = fn.apply(this, args);

		// Store dependency keys
		const dependencyKeys = new Map<number, string>();
		for (const index of invalidateOn) {
			const arg = args[index];
			const argKey = JSON.stringify(arg);
			dependencyKeys.set(index, argKey);

			// Track which cache keys depend on this argument
			if (!dependencyCache.has(argKey)) {
				dependencyCache.set(argKey, new Set());
			}
			const dependencySet = dependencyCache.get(argKey);
			if (dependencySet) {
				dependencySet.add(key);
			}
		}

		// Store in cache
		cache.set(key, {
			value: result as ReturnType<T>,
			timestamp: now,
			dependencyKeys,
		});

		// Enforce max cache size
		if (maxSize < Number.POSITIVE_INFINITY && cache.size > maxSize) {
			const oldestKey = Array.from(cache.keys())[0];
			cache.delete(oldestKey);
		}

		return result as ReturnType<T>;
	}

	// Create the enhanced function type
	const memoizedWithMethods = memoized as unknown as T & {
		clear: () => void;
		invalidate: (...args: Parameters<T>) => void;
	};

	// Add method to manually clear the cache
	memoizedWithMethods.clear = () => {
		cache.clear();
		dependencyCache.clear();
	};

	// Add method to manually invalidate specific keys
	memoizedWithMethods.invalidate = (...args: Parameters<T>) => {
		const key = keyGenerator(...args);
		cache.delete(key);
	};

	return memoizedWithMethods;
}
