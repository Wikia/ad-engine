import { action } from '@wikia/communication';
import { expect } from 'chai';
import { props } from 'ts-action';

describe('action', () => {
	it('should create standard action', () => {
		const actionCreator = action('[Local]', props<{ foo: string }>());
		const example = actionCreator({ foo: 'a' });

		expect(actionCreator.type).to.equal('[Local]');
		expect((actionCreator as any).__global).to.be.undefined;
		expect(example).to.deep.equal({ type: '[Local]', foo: 'a' });
	});
});
