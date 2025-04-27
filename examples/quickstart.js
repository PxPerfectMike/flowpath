import fp from 'flowpath';

// Fluid data transformations
const activeUserNames = fp.from(users).where('active').select('name').toArray();

// Functional pipelines
const processOrder = fp.pipeline(
	fp.validate(validateOrder),
	fp.transform(normalizeOrder),
	fp.branch({
		when: (order) => order.total > 1000,
		action: applyDiscount,
		else: identity,
	}),
	fp.persist(saveOrder)
);

// Async batch processing
const results = await fp.async.batch(urls, {
	process: async (url) => {
		const response = await fetch(url);
		return response.json();
	},
	concurrency: 3,
	retries: 2,
	onProgress: (progress) => {
		console.log(`${progress.completed}/${progress.total}`);
	},
});

// Tree operations
const tree = fp.tree.fromArray(flatItems, {
	idKey: 'id',
	parentIdKey: 'parentId',
});

fp.tree.traverse(tree, (node, depth) => {
	console.log(`${'-'.repeat(depth)} ${node.name}`);
});
