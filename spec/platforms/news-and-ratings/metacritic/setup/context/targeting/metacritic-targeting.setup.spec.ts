// @ts-strict-ignore
import { MetacriticTargetingSetup } from '@wikia/platforms/news-and-ratings/metacritic/setup/context/targeting/metacritic-targeting.setup';
import { expect } from 'chai';

class MockDataLayer {
	events = [];
	add(event) {
		this.events.push(event);
	}
	find(predicate) {
		return this.events.find(predicate);
	}
}

describe('Metacritic Targeting Setup', () => {
	beforeEach(() => {
		window.dataLayer = new MockDataLayer();
	});

	it('getVerticalName() returns "gaming" on gaming section sites', () => {
		window.dataLayer.add({
			event: 'Pageview',
			data: { siteSection: 'games' },
		});

		const verticalName = new MetacriticTargetingSetup().getVerticalName();

		expect(verticalName).to.equal('gaming');
	});

	it('getVerticalName() returns "ent" on section sites different than gaming', () => {
		window.dataLayer.add({
			event: 'Pageview',
			data: { siteSection: 'movies' },
		});

		const verticalName = new MetacriticTargetingSetup().getVerticalName();

		expect(verticalName).to.equal('ent');
	});

	it('getVerticalName() returns "ent" when data is missing from the dataLayer', () => {
		window.dataLayer.add({
			event: 'Pageview',
		});

		const verticalName = new MetacriticTargetingSetup().getVerticalName();

		expect(verticalName).to.equal('ent');
	});

	it('getPageType() returns correct pageType from dataLayer', () => {
		window.dataLayer.add({
			event: 'Pageview',
			data: { pageType: 'article' },
		});

		const ptype = new MetacriticTargetingSetup().getPageType();

		expect(ptype).to.equal('article');
	});

	it('getPageType() returns undefined when pageType is missing from dataLayer', () => {
		window.dataLayer.add({
			event: 'Pageview',
			data: { siteType: 'article' },
		});

		const ptype = new MetacriticTargetingSetup().getPageType();

		expect(ptype).to.be.undefined;
	});

	it('getPageType() returns undefined when data is missing from dataLayer', () => {
		window.dataLayer.add({
			event: 'Pageview',
		});

		const ptype = new MetacriticTargetingSetup().getPageType();

		expect(ptype).to.be.undefined;
	});
});
