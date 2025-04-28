// src/string/template.ts
import { requireDefined, requireType, InvalidArgumentError } from '../errors';

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
	requireType(template, 'string', 'template');
	requireDefined(values, 'values');

	if (
		values === null ||
		typeof values !== 'object' ||
		Array.isArray(values)
	) {
		throw new InvalidArgumentError(
			`Parameter 'values' must be an object`,
			'values',
			values
		);
	}

	const { missingValue = '', throwOnMissing = false } = options;

	return template.replace(/{([^{}]+)}/g, (match, key) => {
		const trimmedKey = key.trim();
		const value = values[trimmedKey];

		if (value === undefined || value === null) {
			if (throwOnMissing) {
				throw new InvalidArgumentError(
					`Missing value for placeholder '{${trimmedKey}}'`,
					trimmedKey,
					value
				);
			}
			return missingValue;
		}

		return String(value);
	});
}
