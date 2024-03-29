import { action, globalAction, isType } from '@wikia/communication';
import { expect } from 'chai';
import { Action, props } from 'ts-action';

describe('isType', () => {
	let results: Action[];
	const localExample = action('[Example]', props<{ foo: string }>());
	const globalExample = globalAction('[Example]', props<{ bar: string }>());
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
		actions.forEach((act) => {
			if (isType(act, localExample)) {
				results.push(act);
			}
		});

		expect(results).to.deep.equal([
			{ type: '[Example]', foo: 'a' },
			{ type: '[Example]', foo: 'c' },
		]);
	});

	it('should pass global for global', () => {
		actions.forEach((act) => {
			if (isType(act, globalExample)) {
				results.push(act);
			}
		});

		expect(results).to.deep.equal([
			{ type: '[Example]', bar: 'b', __global: true },
			{ type: '[Example]', bar: 'd', __global: true },
		]);
	});

	it('should pass for both', () => {
		actions.forEach((act) => {
			if (isType(act, localExample, globalExample)) {
				results.push(act);
			}
		});

		expect(results).to.deep.equal([
			{ type: '[Example]', foo: 'a' },
			{ type: '[Example]', bar: 'b', __global: true },
			{ type: '[Example]', foo: 'c' },
			{ type: '[Example]', bar: 'd', __global: true },
		]);
	});
});
