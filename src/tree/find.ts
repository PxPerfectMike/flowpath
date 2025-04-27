// src/tree/find.ts
import type { TreeNode, TraversalOptions } from './types';
import { traverse } from './traverse';

/**
 * Finds a node in a tree that matches a predicate
 * @param tree The tree to search
 * @param predicate Function that determines whether a node matches
 * @param options Traversal options
 */
export function find<T extends TreeNode>(
	tree: T,
	predicate: (node: T, depth: number, path: number[]) => boolean,
	options: TraversalOptions<T> = {}
): { node: T; depth: number; path: number[] } | null {
	let result: { node: T; depth: number; path: number[] } | null = null;

	traverse(
		tree,
		(node, depth, path) => {
			if (predicate(node, depth, path)) {
				result = { node, depth, path };
				return false; // Stop traversal
			}
			return true;
		},
		options
	);

	return result;
}
