// test/async/batch.test.ts
import { async } from '../../src';

describe('async.batch', () => {
	it('should process items in batches with controlled concurrency', async () => {
		const items = [1, 2, 3, 4, 5];
		const processed: number[] = [];

		const result = await async.batch(items, {
			process: async (item) => {
				processed.push(item);
				return item * 2;
			},
			concurrency: 2,
		});

		expect(result).toEqual([2, 4, 6, 8, 10]);
		expect(processed).toEqual([1, 2, 3, 4, 5]);
	});

	it('should handle retries for failed items', async () => {
		const items = [1, 2, 3];
		const attempts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

		const result = await async.batch(items, {
			process: async (item) => {
				attempts[item]++;

				if (item === 2 && attempts[item] <= 1) {
					throw new Error('Simulated failure');
				}

				return item * 2;
			},
			retries: 2,
			retryDelay: 10,
		});

		expect(result).toEqual([2, 4, 6]);
		expect(attempts).toEqual({ 1: 1, 2: 2, 3: 1 });
	});

	it('should track progress', async () => {
		const items = [1, 2, 3];
		const progressUpdates: Array<{ completed: number; total: number }> = [];

		await async.batch(items, {
			process: async (item) => item * 2,
			onProgress: (progress) => {
				progressUpdates.push({
					completed: progress.completed,
					total: progress.total,
				});
			},
		});

		expect(progressUpdates).toEqual([
			{ completed: 1, total: 3 },
			{ completed: 2, total: 3 },
			{ completed: 3, total: 3 },
		]);
	});
});
