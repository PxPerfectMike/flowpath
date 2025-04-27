// src/pipeline.ts
type PipelineFunction<T, U> = (input: T) => U;

export type PipelineStep<T, U> = PipelineFunction<T, U> | PipelineOptions<T, U>;

export interface PipelineOptions<T, U> {
	transform: PipelineFunction<T, U>;
	name?: string;
	onError?: (error: Error, input: T) => U | never;
}

/**
 * Creates a pipeline of functions that are composed from left to right
 * @param steps The functions to compose
 */
export function pipeline<T, R>(
	...steps: PipelineStep<T, unknown>[]
): (input: T) => R {
	if (steps.length === 0) {
		return (input: T) => input as unknown as R;
	}

	return (input: T): R =>
		steps.reduce((value: unknown, step) => {
			if (typeof step === 'function') {
				try {
					return step(value as T);
				} catch (error) {
					throw new Error(
						`Pipeline step failed: ${
							error instanceof Error
								? error.message
								: String(error)
						}`
					);
				}
			} else {
				try {
					return step.transform(value as T);
				} catch (error) {
					if (step.onError) {
						return step.onError(
							error instanceof Error
								? error
								: new Error(String(error)),
							value as T
						);
					}
					throw new Error(
						`Pipeline step "${step.name || 'unnamed'}" failed: ${
							error instanceof Error
								? error.message
								: String(error)
						}`
					);
				}
			}
		}, input as unknown) as R;
}

/**
 * Creates a conditional branch in a pipeline
 * @param options Branch options
 */
export function branch<T, R = T>(options: {
	when: (input: T) => boolean;
	then: PipelineFunction<T, R>;
	else?: PipelineFunction<T, R>;
}): PipelineFunction<T, R> {
	return (input: T): R => {
		if (options.when(input)) {
			return options.then(input);
		}
		return options.else ? options.else(input) : (input as unknown as R);
	};
}

/**
 * Creates a validation step for a pipeline
 * @param validator Validation function that returns boolean or throws
 * @param errorMessage Optional error message
 */
export function validate<T>(
	validator: (input: T) => boolean | undefined,
	errorMessage = 'Validation failed'
): PipelineFunction<T, T> {
	return (input: T): T => {
		const result = validator(input);
		if (result === false) {
			throw new Error(errorMessage);
		}
		return input;
	};
}

/**
 * Creates a transformation step that applies a function to the input
 * @param transformer Transformation function
 */
export function transform<T, R>(
	transformer: (input: T) => R
): PipelineFunction<T, R> {
	return transformer;
}

/**
 * Creates a side effect step that doesn't modify the pipeline value
 * @param effect Side effect function
 */
export function tap<T>(effect: (input: T) => void): PipelineFunction<T, T> {
	return (input: T): T => {
		effect(input);
		return input;
	};
}

/**
 * Creates an async step that can be used in a pipeline
 * @param asyncFn Async function to execute
 */
export function async<T, R>(
	asyncFn: (input: T) => Promise<R>
): PipelineFunction<T, Promise<R>> {
	return asyncFn;
}

/**
 * Creates a persistence step for a pipeline
 * @param persistFn Function that persists the data
 */
export function persist<T, R = T>(
	persistFn: (input: T) => R
): PipelineFunction<T, R> {
	return persistFn;
}
