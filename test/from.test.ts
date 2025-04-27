// test/from.test.ts
import { from } from '../src/from';

describe('from', () => {
	it('should create a fluid chain for an array', () => {
		const result = from([1, 2, 3, 4, 5])
			.where((x) => x > 2)
			.toArray();

		expect(result).toEqual([3, 4, 5]);
	});

	it('should support property filtering', () => {
		const users = [
			{ id: 1, name: 'Alice', active: true },
			{ id: 2, name: 'Bob', active: false },
			{ id: 3, name: 'Charlie', active: true },
		];

		const result = from(users).where('active').select('name').toArray();

		expect(result).toEqual(['Alice', 'Charlie']);
	});

	it('should support aggregation operations', () => {
		const numbers = [1, 2, 3, 4, 5];

		expect(from(numbers).sum()).toBe(15);
		expect(from(numbers).average()).toBe(3);
		expect(from(numbers).min()).toBe(1);
		expect(from(numbers).max()).toBe(5);
		expect(from(numbers).count()).toBe(5);
	});

	it('should support grouping', () => {
		const users = [
			{ id: 1, role: 'admin', name: 'Alice' },
			{ id: 2, role: 'user', name: 'Bob' },
			{ id: 3, role: 'admin', name: 'Charlie' },
			{ id: 4, role: 'user', name: 'Dave' },
		];

		const result = from(users).group('role').value();

		expect(result).toEqual({
			admin: [
				{ id: 1, role: 'admin', name: 'Alice' },
				{ id: 3, role: 'admin', name: 'Charlie' },
			],
			user: [
				{ id: 2, role: 'user', name: 'Bob' },
				{ id: 4, role: 'user', name: 'Dave' },
			],
		});
	});
});
