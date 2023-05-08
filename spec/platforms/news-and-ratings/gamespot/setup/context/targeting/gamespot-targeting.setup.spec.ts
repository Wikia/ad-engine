import { TargetingService, targetingService } from '@wikia/core';
import { GamespotTargetingSetup } from '@wikia/platforms/news-and-ratings/gamespot/setup/context/targeting/gamespot-targeting.setup';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('Gamespot Targeting Setup', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	afterEach(() => {
		global.sandbox.restore();
	});

	describe('getVerticalName', () => {
		it('returns "ent" when verticalName="ent"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			targetingServiceStub.get.withArgs('verticalName').returns('ent');

			// when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			// then
			expect(verticalName).to.equal('ent');
		});

		it('returns "gaming" when verticalName="gaming"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			targetingServiceStub.get.withArgs('verticalName').returns('gaming');

			// when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			// then
			expect(verticalName).to.equal('gaming');
		});

		it('defaults to  "gaming" when verticalName is not available', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			targetingServiceStub.get.withArgs('verticalName').returns(undefined);

			// when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			// then
			expect(verticalName).to.equal('gaming');
		});
	});
});
