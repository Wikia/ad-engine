import { action, globalAction, ofType } from '@wikia/communication';
import { expect } from 'chai';
import { of } from 'rxjs';
import { Action, props } from 'ts-action';

describe('ofType', () => {
	let results: Action[];
	const localExample = action('[Example]', props<{ foo: string }>());
	const globalExample = globalAction('[Example]', props<{ bar: string }>());
	const action$ = of(
		localExample({ foo: 'a' }),
		globalExample({ bar: 'b' }),
		localExample({ foo: 'c' }),
		globalExample({ bar: 'd' }),
	);

	beforeEach(() => {
		results = [];
	});

	it('should pass local for local', () => {
		action$.pipe(ofType(localExample)).subscribe((action) => {
			results.push(action);
		});

		expect(results).to.deep.equal([
			{ type: '[Example]', foo: 'a' },
			{ type: '[Example]', foo: 'c' },
		]);
	});

	it('should pass global for global', () => {
		action$.pipe(ofType(globalExample)).subscribe((action) => {
			results.push(action);
		});

		expect(results).to.deep.equal([
			{ type: '[Example]', bar: 'b', __global: true },
			{ type: '[Example]', bar: 'd', __global: true },
		]);
	});

	it('should pass for both', () => {
		action$.pipe(ofType(localExample, globalExample)).subscribe((action) => {
			results.push(action);
		});

		expect(results).to.deep.equal([
			{ type: '[Example]', foo: 'a' },
			{ type: '[Example]', bar: 'b', __global: true },
			{ type: '[Example]', foo: 'c' },
			{ type: '[Example]', bar: 'd', __global: true },
		]);
	});
});
