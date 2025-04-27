// src/tree/map.ts
import type { TreeNode, TraversalOptions } from './types';
import { traverse } from './traverse';

/**
 * Maps each node in a tree to a new value
 * @param tree The tree to map
 * @param mapper Function that maps each node to a new value
 * @param options Traversal options
 */
export function map<T extends TreeNode, R extends TreeNode>(
	tree: T,
	mapper: (node: T, depth: number, path: number[]) => R,
	options: TraversalOptions<T> = {}
): R {
	const { childrenKey = 'children' } = options;

	// Clone the tree first to avoid mutating the original
	const clonedTree = JSON.parse(JSON.stringify(tree));
	const result = mapper(clonedTree, 0, []);

	traverse(
		clonedTree,
		(node, depth, path) => {
			const mappedNode = mapper(node, depth, path);

			// Update the parent's reference to this node
			if (path.length > 0) {
				let parent = result;
				for (let i = 0; i < path.length - 1; i++) {
					parent = (parent[childrenKey] as R[])[path[i]];
				}
				(parent[childrenKey] as R[])[path[path.length - 1]] =
					mappedNode;
			}

			return true;
		},
		options
	);

	return result;
}
