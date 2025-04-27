// src/tree/types.ts
export interface TreeNode<T = unknown> {
	[key: string]: unknown;
	children?: TreeNode<T>[];
}

export type TraversalStrategy = 'depthFirst' | 'breadthFirst';

export interface TraversalOptions<T> {
	/**
	 * The key to use for accessing children
	 * @default 'children'
	 */
	childrenKey?: string;

	/**
	 * The traversal strategy to use
	 * @default 'depthFirst'
	 */
	strategy?: TraversalStrategy;

	/**
	 * Maximum depth to traverse
	 * @default Infinity
	 */
	maxDepth?: number;

	/**
	 * Filter function to determine which nodes to visit
	 */
	filter?: (node: T, depth: number, path: number[]) => boolean;
}
