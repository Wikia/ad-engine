import { communicationService } from '@wikia/communication';
import { context } from '@wikia/core';
import { PlayerSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';

describe('PlayerSetup', () => {
	let dispatch: SinonSpy;

	beforeEach(() => {
		context.set('options.wad.blocking', true);
	});

	afterEach(() => {
		context.remove('options.wad.blocking');
		context.remove('options.video.enableStrategyRules');
		context.remove('src');
		context.remove('slots.featured.videoAdUnit');
		context.remove('options.video.enableStrategyRules');
	});

	it('should dispatch jwpSetup action when ad-block detected but without strategy rules flag when strategy rules are disabled', () => {
		context.set('options.video.enableStrategyRules', false);

		dispatch = global.sandbox.spy(communicationService, 'dispatch');
		const playerSetup = new PlayerSetup();
		playerSetup.call();

		expect(dispatch.callCount).to.equal(1);
		expect(dispatch.firstCall.args[0].strategyRulesEnabled).to.be.undefined;
	});

	it('should dispatch jwpSetup action when ad-block detected but with strategy rules flag when strategy rules are enabled', () => {
		context.set('src', 'test');
		context.set('slots.featured.videoAdUnit', '/5441/test/vast/ad/unit');
		context.set('options.video.enableStrategyRules', true);

		dispatch = global.sandbox.spy(communicationService, 'dispatch');
		const playerSetup = new PlayerSetup();
		playerSetup.call();

		expect(dispatch.callCount).to.equal(1);
		expect(dispatch.firstCall.args[0].strategyRulesEnabled).to.be.true;
	});
});
