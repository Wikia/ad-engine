import { globalAction } from '@wikia/communication';
import { expect } from 'chai';
import { props } from 'ts-action';

describe('globalAction', () => {
	it('should create global action', () => {
		const actionCreator = globalAction('[Global]', props<{ bar: string }>());
		const example = actionCreator({ bar: 'a' });

		expect(actionCreator.type).to.equal('[Global]');
		expect((actionCreator as any).__global).to.equal(true);
		expect(example).to.deep.equal({ type: '[Global]', bar: 'a', __global: true });
	});
});
