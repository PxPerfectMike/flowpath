// src/string/template.ts
import { requireDefined } from '../errors';

/**
 * Templates a string by replacing placeholders with values
 * @param template Template string with {placeholders}
 * @param values Values to replace placeholders with
 * @param options Template options
 * @throws {InvalidArgumentError} If template is not a string or values is not an object
 * @example
 * ```ts
 * template('Hello, {name}!', { name: 'World' }); // 'Hello, World!'
 * ```
 */
export function template(
	template: string,
	values: Record<string, unknown>,
	options: {
		/**
		 * What to replace missing values with
		 * @default ''
		 */
		missingValue?: string;
		/**
		 * Whether to throw an error for missing values
		 * @default false
		 */
		throwOnMissing?: boolean;
	} = {}
): string {
	// Validate inputs
	requireDefined(template, 'template');
	if (typeof template !== 'string') {
		throw new Error(`Parameter 'template' must be of type string`);
	}

	requireDefined(values, 'values');
	if (typeof values !== 'object' || values === null) {
		throw new Error(`Parameter 'values' must be an object`);
	}

	const { missingValue = '', throwOnMissing = false } = options;

	return template.replace(/{([^{}]+)}/g, (match, key) => {
		const trimmedKey = key.trim();
		const value = values[trimmedKey];

		if (value === undefined || value === null) {
			if (throwOnMissing) {
				throw new Error(
					`Missing value for placeholder '{${trimmedKey}}'`
				);
			}
			return missingValue;
		}

		return String(value);
	});
}
