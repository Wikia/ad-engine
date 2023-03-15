import { GamespotTargetingSetup } from '@wikia/platforms/news-and-ratings/gamespot/setup/context/targeting/gamespot-targeting.setup';
import { expect } from 'chai';

describe('Gamespot Targeting Setup', () => {
	afterEach(() => {
		window.utag_data = undefined;
	});

	describe('getVerticalName', () => {
		it('returns "gaming" when utag_data is not available', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "ent" on siteSection=entertainment', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'entertainment' };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('ent');
		});

		it('returns "gaming" on siteSection=news when topicName array include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'news', topicName: ['Games'] };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "ent" on siteSection=news when topicName array does not include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'news', topicName: ['TV'] };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('ent');
		});

		it('returns "gaming" on siteSection=news when topicName is not available', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'news' };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" on siteSection=reviews when topicName array include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'reviews', topicName: ['Games'] };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" on siteSection=reviews when topicName array include "Game Review"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'reviews', topicName: ['Games'] };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "ent" on siteSection=reviews when topicName array does not include "Games"', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'reviews', topicName: ['TV'] };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('ent');
		});

		it('returns "gaming" on siteSection=reviews when topicName is not available', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'news' };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" when siteSection does not exist', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = {};

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});

		it('returns "gaming" when siteSection is different than news and entertainment', () => {
			// given
			const gamespotTargetingSetup = new GamespotTargetingSetup();
			window.utag_data = { siteSection: 'different' };

			//when
			const verticalName = gamespotTargetingSetup.getVerticalName();

			//then
			expect(verticalName).to.equal('gaming');
		});
	});
});
