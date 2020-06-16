import { action, globalAction, ofType } from '@wikia/ad-engine';
import { expect } from 'chai';
import { of } from 'rxjs';
import { Action, props } from 'ts-action';

describe('ofType', () => {
	let results: Action[];
	const localExample = action('[Local]', props<{ foo: string }>());
	const globalExample = globalAction('[Global]', props<{ bar: string }>());
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
			{ type: '[Local]', foo: 'a' },
			{ type: '[Local]', foo: 'c' },
		]);
	});

	it('should pass global for global', () => {
		action$.pipe(ofType(globalExample)).subscribe((action) => {
			results.push(action);
		});

		expect(results).to.deep.equal([
			{ type: '[Global]', bar: 'b', __global: true },
			{ type: '[Global]', bar: 'd', __global: true },
		]);
	});

	it('should pass for both', () => {
		action$.pipe(ofType(localExample, globalExample)).subscribe((action) => {
			results.push(action);
		});

		expect(results).to.deep.equal([
			{ type: '[Local]', foo: 'a' },
			{ type: '[Global]', bar: 'b', __global: true },
			{ type: '[Local]', foo: 'c' },
			{ type: '[Global]', bar: 'd', __global: true },
		]);
	});
});
