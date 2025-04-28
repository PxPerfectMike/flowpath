# FlowPath

A modern JavaScript utility library for fluid data transformations and advanced control flow.

[![npm version](https://img.shields.io/npm/v/flowpath.svg)](https://www.npmjs.com/package/flowpath)
[![Build Status](https://travis-ci.org/username/flowpath.svg?branch=main)](https://travis-ci.org/username/flowpath)
[![Coverage Status](https://coveralls.io/repos/github/username/flowpath/badge.svg?branch=main)](https://coveralls.io/github/username/flowpath?branch=main)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/flowpath)](https://bundlephobia.com/result?p=flowpath)

## Features

-   🔄 **Fluid Data Transformations** - Chain operations on collections with a natural and readable syntax
-   🚀 **Functional Programming** - Compose functions into reusable pipelines
-   ⏱️ **Async Utilities** - Control concurrency, retries, and timeouts
-   🌲 **Tree Operations** - Traverse, transform, and query tree structures
-   🏎️ **Performance Optimizations** - Advanced memoization and function optimization

## Installation

```bash
npm install flowpath
```

## Browser Compatibility

FlowPath is designed to work in all modern browsers and provides fallback implementations for older browsers. For optimal compatibility, consider one of the following approaches:

### 1. Use the Polyfill Module

The simplest way to ensure compatibility is to import the polyfill module once at the entry point of your application:

```javascript
import 'flowpath/dist/polyfills';
import fp from 'flowpath';

// Now you can use all features safely in any browser
```

### 2. Use Individual Compatibility Utilities

For more fine-grained control, you can use the browser compatibility utilities directly:

```javascript
import { array, str } from 'flowpath';
import { isSupported } from 'flowpath/utils/browserCompat';

// Check for specific feature support
if (!isSupported('String.padStart')) {
	console.warn('Your browser does not support String.padStart');
}

// All FlowPath utilities work regardless of browser support
const paddedString = str.padStart('42', 5, '0'); // '00042'
```

### 3. Use a Third-Party Polyfill Service

For production applications, we recommend using a dedicated polyfill service like [polyfill.io](https://polyfill.io) or libraries like [core-js](https://github.com/zloirock/core-js):

```html
<!-- Include polyfills before your application -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=Array.from,Object.assign,String.prototype.padStart"></script>
<script src="your-app-bundle.js"></script>
```

### Browser Support

| Feature                | Native Support | FlowPath Support |
| ---------------------- | -------------- | ---------------- |
| Basic ES5 Features     | IE9+           | IE9+             |
| Array.from             | IE11+\*        | IE9+             |
| Object.assign          | IE11+\*        | IE9+             |
| String.prototype.pad\* | Chrome 57+     | All browsers     |
| Promises               | IE11+\*        | All browsers\*\* |
| Symbol                 | IE11+\*        | All browsers\*\* |

\* With polyfills  
\*\* Requires a proper Promise/Symbol polyfill for IE9-10 support

## Usage

```javascript
import fp from 'flowpath';

// Fluid data transformations
const activeUserNames = fp.from(users).where('active').select('name').toArray();

// Function pipelines
const processOrder = fp.pipeline(
	fp.validate(validateOrder),
	fp.transform(normalizeData),
	fp.branch({
		when: (order) => order.total > 1000,
		action: applyDiscount,
		else: identity,
	}),
	fp.persist(saveToDatabase)
);

// Use the pipeline
await processOrder(orderData);
```

For more examples and detailed documentation, see our [API Reference](https://github.com/username/flowpath/blob/main/docs/API.md).

# flowpath
