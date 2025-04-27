// test/tree/fromArray.test.ts
import { tree } from '../../src';

describe('tree.fromArray', () => {
	it('should convert a flat array to a tree structure', () => {
		const items = [
			{ id: 1, name: 'Root', parentId: null },
			{ id: 2, name: 'Child 1', parentId: 1 },
			{ id: 3, name: 'Child 2', parentId: 1 },
			{ id: 4, name: 'Grandchild 1', parentId: 2 },
			{ id: 5, name: 'Grandchild 2', parentId: 2 },
		];

		const result = tree.fromArray(items);

		expect(result).toEqual([
			{
				id: 1,
				name: 'Root',
				parentId: null,
				children: [
					{
						id: 2,
						name: 'Child 1',
						parentId: 1,
						children: [
							{
								id: 4,
								name: 'Grandchild 1',
								parentId: 2,
								children: [],
							},
							{
								id: 5,
								name: 'Grandchild 2',
								parentId: 2,
								children: [],
							},
						],
					},
					{ id: 3, name: 'Child 2', parentId: 1, children: [] },
				],
			},
		]);
	});

	it('should handle custom key names', () => {
		const items = [
			{ uid: 'a', title: 'Root', pid: null },
			{ uid: 'b', title: 'Child 1', pid: 'a' },
			{ uid: 'c', title: 'Child 2', pid: 'a' },
		];

		const result = tree.fromArray(items, {
			idKey: 'uid',
			parentIdKey: 'pid',
			childrenKey: 'nodes',
		});

		expect(result).toEqual([
			{
				uid: 'a',
				title: 'Root',
				pid: null,
				nodes: [
					{ uid: 'b', title: 'Child 1', pid: 'a', nodes: [] },
					{ uid: 'c', title: 'Child 2', pid: 'a', nodes: [] },
				],
			},
		]);
	});

	it('should handle multiple root nodes', () => {
		const items = [
			{ id: 1, name: 'Root 1', parentId: null },
			{ id: 2, name: 'Root 2', parentId: null },
			{ id: 3, name: 'Child of Root 1', parentId: 1 },
			{ id: 4, name: 'Child of Root 2', parentId: 2 },
		];

		const result = tree.fromArray(items);

		expect(result).toEqual([
			{
				id: 1,
				name: 'Root 1',
				parentId: null,
				children: [
					{
						id: 3,
						name: 'Child of Root 1',
						parentId: 1,
						children: [],
					},
				],
			},
			{
				id: 2,
				name: 'Root 2',
				parentId: null,
				children: [
					{
						id: 4,
						name: 'Child of Root 2',
						parentId: 2,
						children: [],
					},
				],
			},
		]);
	});

	it('should handle orphaned nodes (missing parent)', () => {
		const items = [
			{ id: 1, name: 'Root', parentId: null },
			{ id: 2, name: 'Child', parentId: 1 },
			{ id: 3, name: 'Orphan', parentId: 999 }, // Parent doesn't exist
		];

		const result = tree.fromArray(items);

		// Orphaned node should be treated as a root node
		expect(result).toEqual([
			{
				id: 1,
				name: 'Root',
				parentId: null,
				children: [{ id: 2, name: 'Child', parentId: 1, children: [] }],
			},
			{ id: 3, name: 'Orphan', parentId: 999, children: [] },
		]);
	});

	it('should handle empty arrays', () => {
		const result = tree.fromArray([]);
		expect(result).toEqual([]);
	});

	it('should handle custom root ID', () => {
		const items = [
			{ id: 1, name: 'Root', parentId: 0 }, // Using 0 as the root ID
			{ id: 2, name: 'Child 1', parentId: 1 },
			{ id: 3, name: 'Child 2', parentId: 1 },
		];

		const result = tree.fromArray(items, { rootId: 0 });

		expect(result).toEqual([
			{
				id: 1,
				name: 'Root',
				parentId: 0,
				children: [
					{ id: 2, name: 'Child 1', parentId: 1, children: [] },
					{ id: 3, name: 'Child 2', parentId: 1, children: [] },
				],
			},
		]);
	});
});
