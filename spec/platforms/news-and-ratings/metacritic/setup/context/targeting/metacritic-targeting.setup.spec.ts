import { targetingService, TargetingService } from '@wikia/core';
import { MetacriticTargetingSetup } from '@wikia/platforms/news-and-ratings/metacritic/setup/context/targeting/metacritic-targeting.setup';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('Metacritic Targeting Setup', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		targetingServiceStub = global.sandbox.stub(targetingService);
		window.utag_data = undefined;
	});

	describe('getVerticalName', () => {
		it('returns "gaming" when utag_data.siteSection equals to "games"', () => {
			// given
			window.utag_data = { siteSection: 'games' };
			targetingServiceStub.get.withArgs('verticalName').returns('ent');

			// when
			const verticalName = new MetacriticTargetingSetup().getVerticalName();

			// then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" when utag_data not available and "verticalName" equals to "gaming" ', () => {
			// given
			window.utag_data = undefined;
			targetingServiceStub.get.withArgs('verticalName').returns('gaming');

			// when
			const verticalName = new MetacriticTargetingSetup().getVerticalName();

			// then
			expect(verticalName).to.equal('ent');
		});

		it('returns "ent" when utag_data.siteSection is different than "games"', () => {
			// given
			window.utag_data = { siteSection: 'test' };
			targetingServiceStub.get.withArgs('verticalName').returns('gaming');

			// when
			const verticalName = new MetacriticTargetingSetup().getVerticalName();

			// then
			expect(verticalName).to.equal('ent');
		});

		it('returns "ent" when utag_data not available and "verticalName" equals to "ent" ', () => {
			// given
			window.utag_data = undefined;
			targetingServiceStub.get.withArgs('verticalName').returns('ent');

			// when
			const verticalName = new MetacriticTargetingSetup().getVerticalName();

			// then
			expect(verticalName).to.equal('ent');
		});
	});

	describe('getPageType', () => {
		it('return pageType from utag_data when it is available', () => {
			// given
			window.utag_data = { pageType: 'utag_data_ptype' };
			targetingServiceStub.get.withArgs('ptype').returns('targeting_service_ptype');

			// when
			const pageType = new MetacriticTargetingSetup().getPageType();

			// then
			expect(pageType).to.equal('utag_data_ptype');
		});

		it('return pageType from targetingService when utag_data is not available', () => {
			// given
			window.utag_data = undefined;
			targetingServiceStub.get.withArgs('ptype').returns('targeting_service_ptype');

			// when
			const pageType = new MetacriticTargetingSetup().getPageType();

			// then
			expect(pageType).to.equal('targeting_service_ptype');
		});
	});
});
