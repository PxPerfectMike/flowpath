// src/tree/fromArray.ts
export interface FromArrayOptions {
	/**
	 * The name of the id property on the items
	 * @default 'id'
	 */
	idKey?: string;

	/**
	 * The name of the parent id property on the items
	 * @default 'parentId'
	 */
	parentIdKey?: string;

	/**
	 * The name of the children property on the resulting tree nodes
	 * @default 'children'
	 */
	childrenKey?: string;

	/**
	 * Root parent id value
	 * @default null
	 */
	rootId?: string | number | null;
}

/**
 * Converts a flat array of items with parent-child relationships into a tree structure
 * @param items The flat array of items
 * @param options Options for creating the tree
 */
export function fromArray<T extends Record<string, unknown>>(
	items: T[],
	options: FromArrayOptions = {}
): T[] {
	const {
		idKey = 'id',
		parentIdKey = 'parentId',
		childrenKey = 'children',
		rootId = null,
	} = options;

	// Create a map of id to item for quick lookups
	const itemMap = new Map<string | number, T & { [key: string]: unknown }>();
	for (const item of items) {
		const typedItem = item as T & Record<string, unknown>;
		itemMap.set(typedItem[idKey] as string | number, {
			...typedItem,
			[childrenKey]: [],
		});
	}

	// Build the tree by assigning children to their parents
	const rootItems: T[] = [];

	for (const item of itemMap.values()) {
		const parentId = item[parentIdKey] as string | number | null;

		if (parentId === rootId) {
			rootItems.push(item as T);
		} else {
			const parent =
				parentId !== null ? itemMap.get(parentId) : undefined;
			if (parent) {
				(parent[childrenKey] as T[]).push(item as T);
			} else {
				// Parent doesn't exist, treat as root
				rootItems.push(item as T);
			}
		}
	}

	return rootItems;
}
