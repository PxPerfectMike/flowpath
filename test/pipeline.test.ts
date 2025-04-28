// test/pipeline.test.ts
import { pipeline } from '../src';
import { branch } from '../src/pipeline';

describe('pipeline', () => {
	it('should support branch steps', () => {
		// We use 'action' instead of 'then' to avoid confusion with Promises
		// and potential linting issues with object property names
		const process = pipeline(
			(x: number) => x + 2,
			branch({
				when: (x: number) => x % 2 === 0,
				action: (x: number) => x * 2,
				else: (x: number) => x * 3,
			}),
			(x: number) => x * x
		);

		expect(process(5)).toBe(441); // 5+2=7, 7*3=21, 21²=441
		expect(process(4)).toBe(144); // 4+2=6, 6*2=12, 12²=144
	});
});
