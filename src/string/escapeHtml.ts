// src/string/escapeHtml.ts

/**
 * Escapes HTML special characters in a string
 * @param str String to escape
 * @example
 * ```ts
 * escapeHtml('<div>Hello & World</div>'); // '&lt;div&gt;Hello &amp; World&lt;/div&gt;'
 * ```
 */
export function escapeHtml(str: string): string {
	const htmlEscapes: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'/': '&#x2F;',
		'`': '&#x60;',
		'=': '&#x3D;',
	};

	return str.replace(/[&<>"'`=\/]/g, (match) => htmlEscapes[match]);
}
