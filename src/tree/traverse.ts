// src/tree/traverse.ts
import type { TreeNode, TraversalOptions } from './types';

/**
 * Traverses a tree structure and calls a visitor function for each node
 * @param tree The tree to traverse
 * @param visitor Function to call for each node
 * @param options Traversal options
 */
export function traverse<T extends TreeNode>(
	tree: T,
	visitor: (node: T, depth: number, path: number[]) => undefined | boolean,
	options: TraversalOptions<T> = {}
): void {
	const {
		childrenKey = 'children',
		strategy = 'depthFirst',
		maxDepth = Number.POSITIVE_INFINITY,
		filter = () => true,
	} = options;

	if (strategy === 'depthFirst') {
		traverseDepthFirst(tree, 0, []);
	} else {
		traverseBreadthFirst(tree);
	}

	function traverseDepthFirst(node: T, depth: number, path: number[]): void {
		if (depth > maxDepth || !node) return;

		if (filter(node, depth, path)) {
			// If visitor returns false, stop traversing this branch
			if (visitor(node, depth, path) === false) {
				return;
			}
		}

		const children = node[childrenKey];
		if (Array.isArray(children)) {
			children.forEach((child, index) => {
				traverseDepthFirst(child, depth + 1, [...path, index]);
			});
		}
	}

	function traverseBreadthFirst(rootNode: T): void {
		const queue: Array<{ node: T; depth: number; path: number[] }> = [
			{ node: rootNode, depth: 0, path: [] },
		];

		while (queue.length > 0) {
			const shifted = queue.shift();
			if (!shifted) continue;
			const { node, depth, path } = shifted;

			if (depth > maxDepth) continue;

			if (filter(node, depth, path)) {
				// If visitor returns false, don't add children to queue
				if (visitor(node, depth, path) === false) {
					continue;
				}
			}

			const children = node[childrenKey];
			if (Array.isArray(children)) {
				children.forEach((child, index) => {
					queue.push({
						node: child,
						depth: depth + 1,
						path: [...path, index],
					});
				});
			}
		}
	}
}
