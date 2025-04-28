// test/object/pick.test.ts
import { obj } from '../../src';

describe('obj.pick', () => {
	it('should pick specified properties from an object', () => {
		const source = {
			id: 1,
			name: 'Alice',
			age: 30,
			email: 'alice@example.com',
			address: {
				city: 'New York',
				country: 'USA',
			},
		};

		const result = obj.pick(source, ['id', 'name', 'email'] as Array<
			keyof typeof source
		>);

		expect(result).toEqual({
			id: 1,
			name: 'Alice',
			email: 'alice@example.com',
		});
	});

	it('should ignore properties that do not exist', () => {
		const source = { id: 1, name: 'Alice' } as const;

		// For non-existent properties, we need to use type assertion
		// to allow 'age' to be used even though it's not in the object
		const result = obj.pick(source, ['id', 'age' as keyof typeof source]);

		expect(result).toEqual({ id: 1 });
	});

	it('should return an empty object when no properties are specified', () => {
		const source = { id: 1, name: 'Alice' };

		const result = obj.pick(source, [] as Array<keyof typeof source>);

		expect(result).toEqual({});
	});

	it('should return an empty object when the source is an empty object', () => {
		const source = {} as Record<string, unknown>;

		const result = obj.pick(source, ['id', 'name'] as Array<
			keyof typeof source
		>);

		expect(result).toEqual({});
	});

	it('should handle nested properties as objects', () => {
		const source = {
			id: 1,
			user: {
				name: 'Alice',
				details: {
					age: 30,
				},
			},
		};

		const result = obj.pick(source, ['id', 'user'] as Array<
			keyof typeof source
		>);

		expect(result).toEqual({
			id: 1,
			user: {
				name: 'Alice',
				details: {
					age: 30,
				},
			},
		});
	});

	it('should preserve property references', () => {
		const nestedObj = { value: 42 };
		const source = { id: 1, data: nestedObj };

		const result = obj.pick(source, ['data'] as Array<keyof typeof source>);

		expect(result.data).toBe(nestedObj);
	});
});
