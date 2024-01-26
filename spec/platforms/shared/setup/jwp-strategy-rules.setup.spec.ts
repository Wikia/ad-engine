import { Optimizely } from '@wikia/ad-services';
import { context } from '@wikia/core';
import { JwpStrategyRulesSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('JWP Strategy Rules setup', () => {
	const MOCKED_INITIAL_MEDIA_ID = '123';
	let optimizelyServiceStub: SinonStubbedInstance<Optimizely>;
	let subject: JwpStrategyRulesSetup;

	beforeEach(() => {
		optimizelyServiceStub = global.sandbox.createStubInstance(Optimizely);
		window.mw = {
			// @ts-ignore mocking mw.config.get only for the tests
			config: {
				get: () => ({
					mediaId: MOCKED_INITIAL_MEDIA_ID,
				}),
			},
		};
	});

	afterEach(() => {
		global.sandbox.restore();
		context.remove('options.video.enableStrategyRules');
		context.remove('options.video.jwplayer.initialMediaId');
		delete window.mw;
	});

	it('sets initialMediaId in the context when strategy rules enabled', () => {
		optimizelyServiceStub.getVariant.returns('strategy_rules_enabled');

		subject = new JwpStrategyRulesSetup(null, null, optimizelyServiceStub);
		subject.call();

		expect(context.get('options.video.jwplayer.initialMediaId')).to.eql(MOCKED_INITIAL_MEDIA_ID);
	});

	it('does not set initialMediaId in the context when strategy rules disabled', () => {
		optimizelyServiceStub.getVariant.returns('strategy_rules_disabled');

		subject = new JwpStrategyRulesSetup(null, null, optimizelyServiceStub);
		subject.call();

		expect(context.get('options.video.jwplayer.initialMediaId')).to.be.undefined;
	});
});
