import { context } from '@wikia/core';
import { ensureGeoAvailable } from '@wikia/platforms/shared';
import { expect } from 'chai';

describe('ensureGeoAvailable', () => {
	beforeEach(() => {
		// @ts-expect-error ignore partial window.ads
		window.ads = {};
		document.cookie = '';
		context.set('geo', {});
	});

	it('should retrieve geolocation when window.ads.geo is defined', async () => {
		// given
		(window.ads as MediaWikiAds).geo = {
			country: 'PL',
			continent: 'EU',
			region: '12',
		};

		// when
		await ensureGeoAvailable();

		// then
		expect(context.get('geo.country')).to.equal('PL');
		expect(context.get('geo.continent')).to.equal('EU');
		expect(context.get('geo.region')).to.equal('12');
	});

	it('should retrieve geolocation when Geo cookie is defined', async () => {
		// given
		document.cookie =
			'Geo=%7B%22country%22%3A%22PL%22%2C%22continent%22%3A%22EU%22%2C%22region%22%3A%2212%22%7D';

		// when
		await ensureGeoAvailable();

		// then
		expect(context.get('geo.country')).to.equal('PL');
		expect(context.get('geo.continent')).to.equal('EU');
		expect(context.get('geo.region')).to.equal('12');
	});

	it('should retrieve fallback geolocation from Pandora when window.ads.geo and Geo cookie are not defined', async () => {
		// given
		global.sandbox.stub(window, 'XMLHttpRequest').returns({
			open: () => {},
			setRequestHeader: () => {},
			send: () => {},
			timeout: 2000,
			onreadystatechange: () => {},
			responseText:
				'{"country_code":"PL","continent_code":"EU","region":"12","city":"Krakow","country_name":"Poland"}',
		});

		// when
		await ensureGeoAvailable();

		// then
		expect(context.get('geo.country')).to.equal('PL');
		expect(context.get('geo.continent')).to.equal('EU');
		expect(context.get('geo.region')).to.equal('12');
	});
});
