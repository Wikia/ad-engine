import { MetacriticTargetingSetup } from '@wikia/platforms/news-and-ratings/metacritic/setup/context/targeting/metacritic-targeting.setup';
import { expect } from 'chai';

describe('Metacritic Targeting Setup', () => {
	afterEach(() => {
		window.utag_data = undefined;
	});

	it('getVerticalName() returns "gaming" on gaming section sites', () => {
		window.utag_data = { siteSection: 'games' };

		const verticalName = new MetacriticTargetingSetup().getVerticalName();

		expect(verticalName).to.equal('gaming');
	});

	it('getVerticalName() returns "ent" on section sites different than gaming', () => {
		window.utag_data = { siteSection: 'movies' };

		const verticalName = new MetacriticTargetingSetup().getVerticalName();

		expect(verticalName).to.equal('ent');
	});
});
