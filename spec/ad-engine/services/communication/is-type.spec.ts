import { action, globalAction, isType } from '@wikia/ad-engine';
import { expect } from 'chai';
import { Action, props } from 'ts-action';

describe('isType', () => {
	let results: Action[];
	const localExample = action('[Local]', props<{ foo: string }>());
	const globalExample = globalAction('[Global]', props<{ bar: string }>());
	const actions = [
		localExample({ foo: 'a' }),
		globalExample({ bar: 'b' }),
		localExample({ foo: 'c' }),
		globalExample({ bar: 'd' }),
	];

	beforeEach(() => {
		results = [];
	});

	it('should pass local for local', () => {
		actions.forEach((action) => {
			if (isType(action, localExample)) {
				results.push(action);
			}
		});

		expect(results).to.deep.equal([
			{ type: '[Local]', foo: 'a' },
			{ type: '[Local]', foo: 'c' },
		]);
	});

	it('should pass global for global', () => {
		actions.forEach((action) => {
			if (isType(action, globalExample)) {
				results.push(action);
			}
		});

		expect(results).to.deep.equal([
			{ type: '[Global]', bar: 'b', __global: true },
			{ type: '[Global]', bar: 'd', __global: true },
		]);
	});

	it('should pass for both', () => {
		actions.forEach((action) => {
			if (isType(action, localExample, globalExample)) {
				results.push(action);
			}
		});

		expect(results).to.deep.equal([
			{ type: '[Local]', foo: 'a' },
			{ type: '[Global]', bar: 'b', __global: true },
			{ type: '[Local]', foo: 'c' },
			{ type: '[Global]', bar: 'd', __global: true },
		]);
	});
});
