// @ts-strict-ignore
import { context, InstantConfigService } from '@wikia/core';
import { JwpStrategyRulesSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('JWP Strategy Rules setup', () => {
	const MOCKED_INITIAL_MEDIA_ID = '123';
	let instantConfigStub: SinonStubbedInstance<InstantConfigService>;
	let subject: JwpStrategyRulesSetup;

	beforeEach(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
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
		instantConfigStub.get.withArgs('icFeaturedVideoPlayer').returns('jwp-strategy-rules');

		subject = new JwpStrategyRulesSetup(instantConfigStub, null);
		subject.call();

		expect(context.get('options.video.jwplayer.initialMediaId')).to.eql(MOCKED_INITIAL_MEDIA_ID);
	});

	it('does not set initialMediaId in the context when strategy rules disabled', () => {
		instantConfigStub.get.withArgs('icFeaturedVideoPlayer').returns(undefined);

		subject = new JwpStrategyRulesSetup(instantConfigStub, null);
		subject.call();

		expect(context.get('options.video.jwplayer.initialMediaId')).to.be.undefined;
	});
});
