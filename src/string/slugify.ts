// src/string/slugify.ts

/**
 * Converts a string to a URL-friendly slug
 * @param str String to slugify
 * @example
 * ```ts
 * slugify('Hello, World!'); // 'hello-world'
 * slugify('Спасибо!'); // 'spasibo'
 * ```
 */
export function slugify(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/[\s_-]+/g, '-') // Replace spaces, underscores and hyphens with a single hyphen
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
