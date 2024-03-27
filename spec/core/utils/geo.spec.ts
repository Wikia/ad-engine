import { context } from '@wikia/core/services';
import { geoService } from '@wikia/core/utils';
import { assert } from 'chai';

describe('Geo', () => {
	beforeEach(() => {
		context.set('geo.continent', 'EU');
		context.set('geo.country', 'PL');
		context.set('geo.region', '72');
	});

	it('returns country and continent code', () => {
		assert.equal(geoService.getCountryCode(), 'PL');
		assert.equal(geoService.getContinentCode(), 'EU');
	});

	it('returns region code', () => {
		assert.equal(geoService.getRegionCode(), '72');
	});

	it('geoService.isProperGeo test empty', () => {
		assert.notOk(geoService.isProperGeo());
	});

	it('geoService.isProperGeo test - region', () => {
		// Region
		assert.ok(geoService.isProperGeo(['PL-72']));
		assert.ok(geoService.isProperGeo(['ZZ', 'PL-72']));
		assert.notOk(geoService.isProperGeo(['ZZ', 'PL-33']));
		assert.notOk(geoService.isProperGeo(['ZZ']));
	});

	it('geoService.isProperGeo test - country', () => {
		assert.ok(geoService.isProperGeo(['PL']));
		assert.ok(geoService.isProperGeo(['ZZ', 'PL']));
		assert.notOk(geoService.isProperGeo(['ZZ', 'YY']));
	});

	it('geoService.isProperGeo test - continent', () => {
		assert.ok(geoService.isProperGeo(['XX-EU']));
		assert.ok(geoService.isProperGeo(['XX-NA', 'XX-EU']));
		assert.notOk(geoService.isProperGeo(['XX-NA', 'XX-SA']));
		assert.notOk(geoService.isProperGeo(['XX-NA', 'XX-SA']));
	});

	it('geoService.isProperGeo test - earth', () => {
		assert.ok(geoService.isProperGeo(['XX']));
		assert.ok(geoService.isProperGeo(['XX', 'DE']));
	});

	it('geoService.isProperGeo test - lack of region and continent', () => {
		context.set('geo.continent', null);
		context.set('geo.region', null);
		assert.ok(geoService.isProperGeo(['PL']));
		assert.notOk(geoService.isProperGeo(['PL-72']));
		assert.notOk(geoService.isProperGeo(['DE']));
		assert.notOk(geoService.isProperGeo(['EU']));
	});

	it('geoService.isProperGeo test - lack of all geos', () => {
		context.set('geo.continent', null);
		context.set('geo.country', null);
		context.set('geo.region', null);
		assert.notOk(geoService.isProperGeo(['PL']));
		assert.notOk(geoService.isProperGeo(['PL-72']));
		assert.notOk(geoService.isProperGeo(['DE']));
		assert.notOk(geoService.isProperGeo(['EU']));
		assert.ok(geoService.isProperGeo(['XX']));
	});
});
