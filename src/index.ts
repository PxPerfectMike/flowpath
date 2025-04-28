// src/index.ts
import * as array from './array';
import * as async from './async';
import * as fn from './function';
import * as obj from './object';
import * as str from './string';
import * as tree from './tree';
import * as errors from './errors';
import { pipeline } from './pipeline';
import { from } from './from';

export { array, async, fn, obj, str, tree, errors, pipeline, from };

// For convenient namespace access
export default {
	array,
	async,
	fn,
	obj,
	str,
	tree,
	errors,
	pipeline,
	from,
};
