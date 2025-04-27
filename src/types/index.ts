// src/types/index.ts

/**
 * Generic record type
 */
export type Dict<T = unknown> = Record<string, T>;

/**
 * Function with any signature
 */
export type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Predicate function that returns a boolean
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Transformer function that maps from one type to another
 */
export type Transformer<T, R> = (value: T) => R;

/**
 * Async variant of a function
 */
export type Async<T extends AnyFunction> = (
	...args: Parameters<T>
) => Promise<ReturnType<T>>;

/**
 * Function that returns a promise
 */
export type AsyncFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

/**
 * Make specific properties of an object nullable
 */
export type Nullable<T, K extends keyof T> = Omit<T, K> & {
	[P in K]: T[P] | null;
};

/**
 * Make specific properties of an object optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & {
	[P in K]?: T[P];
};

/**
 * Make all properties of an object deeply readonly
 */
export type DeepReadonly<T> = T extends (infer R)[]
	? DeepReadonlyArray<R>
	: T extends (...args: unknown[]) => unknown
	? T
	: T extends object
	? DeepReadonlyObject<T>
	: T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>;
};

/**
 * Extract the type of an array element
 */
export type ElementType<T extends readonly unknown[]> =
	T extends readonly (infer E)[] ? E : never;

/**
 * Unwrap a promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Convert union type to intersection type
 */
export type UnionToIntersection<U> = (
	U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never;
