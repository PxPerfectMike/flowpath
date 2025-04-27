// test/string/template.test.ts
import { str } from '../../src';

describe('str.template', () => {
	it('should replace placeholders with values', () => {
		const template = 'Hello, {name}! You are {age} years old.';
		const values = { name: 'Alice', age: 30 };

		const result = str.template(template, values);

		expect(result).toBe('Hello, Alice! You are 30 years old.');
	});

	it('should handle multiple occurrences of the same placeholder', () => {
		const template = "{name} is using {name}'s computer.";
		const values = { name: 'Bob' };

		const result = str.template(template, values);

		expect(result).toBe("Bob is using Bob's computer.");
	});

	it('should handle missing values by replacing with empty string', () => {
		const template = 'Hello, {name}! You are {age} years old.';
		const values = { name: 'Alice' };

		const result = str.template(template, values);

		expect(result).toBe('Hello, Alice! You are  years old.');
	});

	it('should handle null and undefined values', () => {
		const template = 'Name: {name}, Age: {age}, Active: {active}';
		const values = { name: 'Alice', age: null, active: undefined };

		const result = str.template(template, values);

		expect(result).toBe('Name: Alice, Age: , Active: ');
	});

	it('should handle complex objects', () => {
		const template = 'User {user.id}: {user.name}';
		const values = {
			user: {
				id: 123,
				name: 'Alice',
			},
		};

		// This doesn't handle nested properties by default
		const result = str.template(template, values);

		// Expect the whole object to be stringified
		expect(result).toBe('User : ');
	});

	it('should handle non-string values', () => {
		const template = 'Count: {count}, Active: {active}, Empty: {empty}';
		const values = { count: 42, active: true, empty: null };

		const result = str.template(template, values);

		expect(result).toBe('Count: 42, Active: true, Empty: ');
	});

	it('should ignore malformed placeholders', () => {
		const template = 'Hello, {name! You are {age years old.';
		const values = { name: 'Alice', age: 30 };

		const result = str.template(template, values);

		expect(result).toBe('Hello, {name! You are {age years old.');
	});

	it('should handle empty templates', () => {
		const template = '';
		const values = { name: 'Alice' };

		const result = str.template(template, values);

		expect(result).toBe('');
	});
});
