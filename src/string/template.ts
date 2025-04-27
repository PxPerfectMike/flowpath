// src/string/template.ts

/**
 * Templates a string by replacing placeholders with values
 * @param template Template string with {placeholders}
 * @param values Values to replace placeholders with
 * @example
 * ```ts
 * template('Hello, {name}!', { name: 'World' }); // 'Hello, World!'
 * ```
 */
export function template(
	template: string,
	values: Record<string, unknown>
): string {
	return template.replace(/{([^{}]+)}/g, (_, key) =>
		String(values[key.trim()] ?? '')
	);
}
