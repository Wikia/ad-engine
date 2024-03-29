// @ts-strict-ignore
import { GamespotTargetingSetup } from '@wikia/platforms/news-and-ratings/gamespot/setup/context/targeting/gamespot-targeting.setup';
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

describe('Gamespot Targeting Setup', () => {
	beforeEach(() => {
		window.dataLayer = new MockDataLayer();
	});

	describe('getVerticalName', () => {
		it('returns "gaming" when google_tag_manager is not available', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "true" when isEntertainmentSite() receives pathname that includes entertainment', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			global.sandbox.stub(window, 'location').value({
				pathname: '/entertainment',
			});

			//when
			const isEnt = gamespotTargetingSetup.isEntertainmentSite(window.location.pathname);

			//then
			expect(isEnt).to.equal(true);
		});

		it('returns "gaming" on siteSection=news when topicName is not available', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'news' },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" on siteSection=news when topicName is empty array', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'news' },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" on siteSection=news when topicName array include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'news', topicName: ['Games'] },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" on siteSection=news when topicName does not include "Games" but contentTopicId does', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'news', topicName: ['Tech'], contentTopicName: 'gaming-tech' },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "ent" on siteSection=news when topicName array does not include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'news', topicName: ['Tech'] },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('ent');
		});

		it('returns "gaming" on siteSection=reviews when topicName array include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'reviews', topicName: ['Games'] },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" on siteSection=reviews when topicName array include "Game Review"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'reviews', topicName: ['Games'] },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "ent" on siteSection=reviews when topicName array does not include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'reviews', topicName: ['TV'] },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('ent');
		});

		it('returns "gaming" on siteSection=galleries when topicName array include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'galleries', topicName: ['Games'] },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "ent" on siteSection=galleries when topicName array does not include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'galleries', topicName: ['TV'] },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('ent');
		});

		it('returns "gaming" on siteSection=reviews when topicName is not available', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'news' },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" when siteSection does not exist', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: {},
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" when data array is missing in dataLayer', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" when siteSection is different than news and entertainment', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.dataLayer.add({
				event: 'Pageview',
				data: { siteSection: 'different' },
			});

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});
	});
});
