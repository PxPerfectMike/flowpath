// src/utils/typeChecks.ts
export function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !isArray(value);
}

export function isFunction(
	value: unknown
): value is (...args: unknown[]) => unknown {
	return typeof value === 'function';
}

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
	return typeof value === 'number' && !Number.isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

export function isUndefined(value: unknown): value is undefined {
	return typeof value === 'undefined';
}

export function isNull(value: unknown): value is null {
	return value === null;
}

export function isPrimitive(value: unknown): boolean {
	return (
		isString(value) ||
		isNumber(value) ||
		isBoolean(value) ||
		isNull(value) ||
		isUndefined(value)
	);
}
