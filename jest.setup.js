// jest.setup.js

// Extend Jest's expect functions if needed
expect.extend({
	// Add custom matchers here if needed
});

// Set up additional global test utilities
global.waitFor = async (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

// Provide better error messages for promises
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Promise Rejection:');
	console.error(reason);
});

// Suppress noisy console output during tests
const originalConsoleError = console.error;
console.error = (...args) => {
	if (
		args[0] &&
		typeof args[0] === 'string' &&
		(args[0].includes('Warning:') || args[0].includes('Error:'))
	) {
		return; // Suppress expected warnings/errors during tests
	}
	originalConsoleError(...args);
};
