// src/from.ts
import { isArray, isObject } from './utils/typeChecks';

// Define better return types for the group operation
type GroupResult<T> = Record<string, T[]>;

// Type for objects with indexable properties
type Indexable = Record<string | number | symbol, unknown>;

// FluidChain interface with improved typing
export type FluidChain<T> = {
	// Collection operations
	where: (predicate: string | ((item: T) => boolean)) => FluidChain<T>;
	select: <K extends keyof T>(key: K) => FluidChain<T[K]>;
	sort: (compareFn?: (a: T, b: T) => number) => FluidChain<T>;
	group: <K extends keyof T | ((item: T) => unknown)>(
		keyOrFn: K
	) => FluidChain<GroupResult<T>>;

	// Terminal operations
	value: () => T[];
	toArray: () => T[];
	toObject: () => Record<string, unknown>;
	toMap: () => Map<string | number, unknown>;
	sum: () => number;
	average: () => number;
	count: () => number;
	min: () => number | undefined;
	max: () => number | undefined;
	first: () => T | undefined;
	last: () => T | undefined;
	single: () => T;
};

/**
 * Creates a chainable query over an array or object
 * @param source The array or object to query
 */
export function from<T>(
	source: T[] | Record<string, T> | Map<unknown, T>
): FluidChain<T> {
	// Convert source to array for uniform processing
	let data: T[] = [];

	if (isArray(source)) {
		data = [...source];
	} else if (isObject(source)) {
		data = Object.values(source);
	} else if (source && typeof source === 'object') {
		// Check if source is a Map-like object
		const sourceObj = source as unknown as { values?: () => Iterable<T> };
		if (sourceObj.values && typeof sourceObj.values === 'function') {
			try {
				data = Array.from(sourceObj.values());
			} catch (e) {
				data = [];
			}
		}
	}

	// Keep track of whether we've transformed to a GroupResult
	let isGrouped = false;
	let groupedData: GroupResult<T> | null = null;

	const api: FluidChain<T> = {
		// Collection operations
		where(predicate) {
			if (isGrouped && groupedData) {
				// Reset to ungrouped data for filtering
				const allItems: T[] = [];
				for (const key in groupedData) {
					allItems.push(...groupedData[key]);
				}
				data = allItems;
				isGrouped = false;
				groupedData = null;
			}

			if (typeof predicate === 'string') {
				// Handle property existence or truthy value
				data = data.filter((item) => {
					if (isObject(item)) {
						const itemAsRecord = item as unknown as Indexable;
						return Boolean(itemAsRecord[predicate]);
					}
					return false;
				});
			} else if (typeof predicate === 'function') {
				data = data.filter(predicate);
			}
			return api;
		},

		select<K extends keyof T>(key: K) {
			if (isGrouped && groupedData) {
				// Reset to ungrouped data for mapping
				const allItems: T[] = [];
				for (const key in groupedData) {
					allItems.push(...groupedData[key]);
				}
				data = allItems;
				isGrouped = false;
				groupedData = null;
			}

			const mappedData = data.map((item) => {
				if (isObject(item)) {
					return item[key];
				}
				throw new Error('Cannot select key from non-object item');
			});
			return from(mappedData as unknown[]) as unknown as FluidChain<T[K]>;
		},

		sort(compareFn) {
			if (isGrouped && groupedData) {
				// Reset to ungrouped data for sorting
				const allItems: T[] = [];
				for (const key in groupedData) {
					allItems.push(...groupedData[key]);
				}
				data = allItems;
				isGrouped = false;
				groupedData = null;
			}

			data = [...data].sort(compareFn);
			return api;
		},

		group<K extends keyof T | ((item: T) => unknown)>(keyOrFn: K) {
			const result: GroupResult<T> = {};

			for (const item of data) {
				let key: unknown;
				if (typeof keyOrFn === 'function') {
					key = (keyOrFn as (item: T) => unknown)(item);
				} else if (isObject(item)) {
					const itemAsRecord = item as unknown as Indexable;
					key = itemAsRecord[keyOrFn as string | number | symbol];
				} else {
					key = String(item);
				}

				// Convert key to string for object grouping
				const keyStr = String(key);
				if (!result[keyStr]) {
					result[keyStr] = [];
				}
				result[keyStr].push(item);
			}

			isGrouped = true;
			groupedData = result;
			data = []; // Clear data since we're now using groupedData
			return api as unknown as FluidChain<GroupResult<T>>;
		},

		// Terminal operations
		value() {
			if (isGrouped && groupedData) {
				// Flatten grouped data into a single array
				return Object.values(groupedData).flat() as T[];
			}
			return data;
		},

		toArray() {
			if (isGrouped && groupedData) {
				return Object.values(groupedData).flat() as T[];
			}
			return [...data];
		},

		toObject() {
			const result: Record<string, unknown> = {};

			// If grouped, convert grouped data to object
			if (isGrouped && groupedData) {
				return groupedData as unknown as Record<string, unknown>;
			}

			// Otherwise process the array data
			if (data.length > 0 && isArray(data[0]) && data[0].length === 2) {
				// Handle array of [key, value] pairs
				for (const item of data) {
					const pair = item as unknown as [unknown, unknown];
					result[String(pair[0])] = pair[1];
				}
				return result;
			}

			// Try to use a property named 'id' or similar as key
			for (let i = 0; i < data.length; i++) {
				const item = data[i];
				if (isObject(item)) {
					const itemAsRecord = item as unknown as Indexable;
					const key =
						itemAsRecord.id ||
						itemAsRecord.key ||
						itemAsRecord.name ||
						i;
					result[String(key)] = item;
				} else {
					result[String(i)] = item;
				}
			}
			return result;
		},

		toMap() {
			const result = new Map<string | number, unknown>();

			// If grouped, convert grouped data to map
			if (isGrouped && groupedData) {
				for (const key in groupedData) {
					result.set(key, groupedData[key]);
				}
				return result;
			}

			// Otherwise process the array data
			if (data.length > 0 && isArray(data[0]) && data[0].length === 2) {
				// Handle array of [key, value] pairs
				for (const item of data) {
					const pair = item as unknown as [unknown, unknown];
					result.set(String(pair[0]), pair[1]);
				}
				return result;
			}

			// Try to use a property named 'id' or similar as key
			for (let i = 0; i < data.length; i++) {
				const item = data[i];
				if (isObject(item)) {
					const itemAsRecord = item as unknown as Indexable;
					const key =
						itemAsRecord.id ||
						itemAsRecord.key ||
						itemAsRecord.name ||
						i;
					result.set(key as string | number, item);
				} else {
					result.set(i, item);
				}
			}
			return result;
		},

		sum(): number {
			let values: unknown[] = [];

			if (isGrouped && groupedData) {
				// Flatten grouped data
				values = Object.values(groupedData).flat();
			} else {
				values = data;
			}

			return values.reduce(
				(sum: number, val) => sum + (typeof val === 'number' ? val : 0),
				0
			);
		},

		average(): number {
			const total = this.sum();
			const count = this.count();
			return count > 0 ? total / count : 0;
		},

		count() {
			if (isGrouped && groupedData) {
				// Count items in grouped data
				let count = 0;
				for (const key in groupedData) {
					count += groupedData[key].length;
				}
				return count;
			}
			return data.length;
		},

		min() {
			let values: unknown[] = [];

			if (isGrouped && groupedData) {
				values = Object.values(groupedData).flat();
			} else {
				values = data;
			}

			const numValues = values.filter(
				(val) => typeof val === 'number'
			) as number[];
			if (numValues.length === 0) return undefined;
			return Math.min(...numValues);
		},

		max() {
			let values: unknown[] = [];

			if (isGrouped && groupedData) {
				values = Object.values(groupedData).flat();
			} else {
				values = data;
			}

			const numValues = values.filter(
				(val) => typeof val === 'number'
			) as number[];
			if (numValues.length === 0) return undefined;
			return Math.max(...numValues);
		},

		first() {
			if (isGrouped && groupedData) {
				const firstKey = Object.keys(groupedData)[0];
				return firstKey ? groupedData[firstKey][0] : undefined;
			}
			return data.length > 0 ? data[0] : undefined;
		},

		last() {
			if (isGrouped && groupedData) {
				const keys = Object.keys(groupedData);
				const lastKey = keys[keys.length - 1];
				const lastGroup = lastKey ? groupedData[lastKey] : [];
				return lastGroup.length > 0
					? lastGroup[lastGroup.length - 1]
					: undefined;
			}
			return data.length > 0 ? data[data.length - 1] : undefined;
		},

		single() {
			if (isGrouped && groupedData) {
				const allItems = Object.values(groupedData).flat();
				if (allItems.length !== 1) {
					throw new Error('Expected exactly one item');
				}
				return allItems[0];
			}

			if (data.length !== 1) {
				throw new Error('Expected exactly one item');
			}
			return data[0];
		},
	};

	return api;
}
