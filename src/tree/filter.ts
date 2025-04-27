// src/tree/filter.ts
import type { TreeNode, TraversalOptions } from './types';
import { traverse } from './traverse';

/**
 * Filters nodes in a tree based on a predicate
 * @param tree The tree to filter
 * @param predicate Function that determines whether to keep a node
 * @param options Traversal options
 */
export function filter<T extends TreeNode>(
	tree: T,
	predicate: (node: T, depth: number, path: number[]) => boolean,
	options: TraversalOptions<T> = {}
): T | null {
	const { childrenKey = 'children' } = options;

	type NodeWithChildren = T & { [key: string]: T[] };

	// Clone the tree to avoid mutating the original
	const clonedTree = JSON.parse(JSON.stringify(tree));

	// Check if the root node should be included
	if (!predicate(clonedTree, 0, [])) {
		return null;
	}

	// Removed redundant line causing the error
	function filterChildren(node: T, depth: number, path: number[]): void {
		const children = node[childrenKey];
		if (!Array.isArray(children)) return;

		const filteredChildren = children.filter((child, index) =>
			predicate(child, depth + 1, [...path, index])
		);
		(node as unknown as Record<string, T[]>)[childrenKey] =
			filteredChildren;
		// Replace with filtered children
		(node as unknown as Record<string, T[]>)[childrenKey] =
			filteredChildren;

		// Recursively filter grandchildren
		filteredChildren.forEach((child, index) => {
			filterChildren(child, depth + 1, [...path, index]);
		});
	}

	filterChildren(clonedTree, 0, []);
	return clonedTree;
}
