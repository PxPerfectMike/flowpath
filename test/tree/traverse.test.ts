// test/tree/traverse.test.ts
import { tree } from '../../src';

describe('tree.traverse', () => {
	const testTree = {
		id: 'root',
		name: 'Root',
		children: [
			{
				id: 'a',
				name: 'Node A',
				children: [
					{ id: 'a1', name: 'Node A1' },
					{ id: 'a2', name: 'Node A2' },
				],
			},
			{
				id: 'b',
				name: 'Node B',
				children: [{ id: 'b1', name: 'Node B1' }],
			},
		],
	};

	it('should traverse a tree depth-first', () => {
		const visited = [] as string[];

		tree.traverse(testTree, (node) => {
			visited.push(node.id);
		});

		expect(visited).toEqual(['root', 'a', 'a1', 'a2', 'b', 'b1']);
	});

	it('should traverse a tree breadth-first', () => {
		const visited = [] as string[];

		tree.traverse(
			testTree,
			(node) => {
				visited.push(node.id);
			},
			{ strategy: 'breadthFirst' }
		);

		expect(visited).toEqual(['root', 'a', 'b', 'a1', 'a2', 'b1']);
	});

	it('should respect max depth', () => {
		const visited = [] as string[];

		tree.traverse(
			testTree,
			(node) => {
				visited.push(node.id);
			},
			{ maxDepth: 1 }
		);

		expect(visited).toEqual(['root', 'a', 'b']);
	});

	it('should apply filter', () => {
		const visited = [] as string[];

		tree.traverse(
			testTree,
			(node) => {
				visited.push(node.id);
			},
			{
				filter: (node) => node.id.startsWith('a'),
			}
		);

		expect(visited).toEqual(['a', 'a1', 'a2']);
	});
});
