// src/string/unescapeHtml.ts

/**
 * Unescapes HTML entities in a string
 * @param str String to unescape
 * @example
 * ```ts
 * unescapeHtml('&lt;div&gt;Hello &amp; World&lt;/div&gt;'); // '<div>Hello & World</div>'
 * ```
 */
export function unescapeHtml(str: string): string {
	const htmlUnescapes: Record<string, string> = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
		'&#x2F;': '/',
		'&#x60;': '`',
		'&#x3D;': '=',
	};

	return str.replace(
		/&(?:amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/g,
		(match) => htmlUnescapes[match]
	);
}
