import { geoService } from '@wikia/ad-engine/utils';
import { assert } from 'chai';
import * as Cookies from 'js-cookie';
import * as sinon from 'sinon';
import { context, sessionCookie } from '../../../src/ad-engine/services';

describe('Geo', () => {
	let sandbox;

	beforeEach(() => {
		context.set('geo.continent', 'EU');
		context.set('geo.country', 'PL');
		context.set('geo.region', '72');

		sandbox = sinon.sandbox.create();
		sandbox.stub(Math, 'random');
		sandbox.stub(Cookies, 'get');
	});

	afterEach(() => {
		geoService.resetSamplingCache();
		sandbox.restore();
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
		assert.ok(geoService.isProperGeo(['ZZ', 'PL-72', 'non-PL-33']));
		assert.notOk(geoService.isProperGeo(['ZZ', 'PL-33']));
		assert.notOk(geoService.isProperGeo(['non-PL-72']));
		assert.notOk(geoService.isProperGeo(['ZZ', 'non-PL-72']));
		assert.notOk(geoService.isProperGeo(['ZZ', 'PL-72', 'non-PL-72']));
	});

	it('geoService.isProperGeo test - country', () => {
		assert.ok(geoService.isProperGeo(['PL']));
		assert.ok(geoService.isProperGeo(['ZZ', 'PL', 'non-YY']));
		assert.notOk(geoService.isProperGeo(['ZZ', 'YY']));
		assert.notOk(geoService.isProperGeo(['non-PL']));
		assert.notOk(geoService.isProperGeo(['ZZ', 'non-PL']));
		assert.notOk(geoService.isProperGeo(['ZZ', 'PL', 'non-PL']));
	});

	it('geoService.isProperGeo test - continent', () => {
		assert.ok(geoService.isProperGeo(['XX-EU']));
		assert.ok(geoService.isProperGeo(['XX-NA', 'XX-EU', 'non-XX-SA']));
		assert.notOk(geoService.isProperGeo(['XX-NA', 'XX-SA']));
		assert.notOk(geoService.isProperGeo(['XX-NA', 'XX-SA', 'non-XX-EU']));
		assert.notOk(geoService.isProperGeo(['XX-NA', 'XX-EU', 'non-XX-EU']));
		assert.notOk(geoService.isProperGeo(['non-XX-EU']));
	});

	it('geoService.isProperGeo test - earth', () => {
		assert.ok(geoService.isProperGeo(['XX']));
		assert.ok(geoService.isProperGeo(['XX', 'non-PL-33']));
		assert.notOk(geoService.isProperGeo(['XX', 'non-PL-72']));
		assert.ok(geoService.isProperGeo(['XX', 'non-DE']));
		assert.notOk(geoService.isProperGeo(['XX', 'non-PL']));
		assert.ok(geoService.isProperGeo(['XX', 'non-XX-SA']));
		assert.notOk(geoService.isProperGeo(['XX', 'non-XX-EU']));
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

	it('samples traffic for earth', () => {
		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['XX/100']));

		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['XX/50']));

		Math.random.returns(0.1);
		assert.ok(geoService.isProperGeo(['XX/50']));

		Math.random.returns(0.1);
		assert.notOk(geoService.isProperGeo(['non-XX/50']));

		Math.random.returns(0.49);
		assert.ok(geoService.isProperGeo(['XX/50']));

		Math.random.returns(0.499999);
		assert.ok(geoService.isProperGeo(['XX/50']));

		Math.random.returns(0.5);
		assert.notOk(geoService.isProperGeo(['XX/50']));

		Math.random.returns(0.6);
		assert.notOk(geoService.isProperGeo(['XX/50']));

		Math.random.returns(0.8);
		assert.notOk(geoService.isProperGeo(['XX/50']));

		Math.random.returns(0.99);
		assert.notOk(geoService.isProperGeo(['XX/50']));

		Math.random.returns(0.999999);
		assert.notOk(geoService.isProperGeo(['XX/50']));
	});

	it('samples traffic for continent', () => {
		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['XX-EU/100']));

		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['XX-EU/50']));

		Math.random.returns(0.1);
		assert.ok(geoService.isProperGeo(['XX-EU/50']));

		Math.random.returns(0.1);
		assert.notOk(geoService.isProperGeo(['non-XX-EU/50']));

		Math.random.returns(0.49);
		assert.ok(geoService.isProperGeo(['XX-EU/50']));

		Math.random.returns(0.499999);
		assert.ok(geoService.isProperGeo(['XX-EU/50']));

		Math.random.returns(0.5);
		assert.notOk(geoService.isProperGeo(['XX-EU/50']));

		Math.random.returns(0.6);
		assert.notOk(geoService.isProperGeo(['XX-EU/50']));

		Math.random.returns(0.8);
		assert.notOk(geoService.isProperGeo(['XX-EU/50']));

		Math.random.returns(0.99);
		assert.notOk(geoService.isProperGeo(['XX-EU/50']));

		Math.random.returns(0.999999);
		assert.notOk(geoService.isProperGeo(['XX-EU/50']));
	});

	it('samples traffic for country', () => {
		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['PL/100']));

		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.1);
		assert.ok(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.1);
		assert.notOk(geoService.isProperGeo(['non-PL/50']));

		Math.random.returns(0.49);
		assert.ok(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.499999);
		assert.ok(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.5);
		assert.notOk(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.6);
		assert.notOk(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.8);
		assert.notOk(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.99);
		assert.notOk(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.999999);
		assert.notOk(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.999999);
		assert.notOk(geoService.isProperGeo(['PL/50']));

		Math.random.returns(0.999999);
		assert.notOk(geoService.isProperGeo(['non-PL/50']));
	});

	it('samples traffic for region', () => {
		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['PL-72/100']));

		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.1);
		assert.ok(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.1);
		assert.notOk(geoService.isProperGeo(['non-PL-72/50']));

		Math.random.returns(0.49);
		assert.ok(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.5);
		assert.notOk(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.6);
		assert.notOk(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.8);
		assert.notOk(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.99);
		assert.notOk(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.999999);
		assert.notOk(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.999999);
		assert.notOk(geoService.isProperGeo(['PL-72/50']));

		Math.random.returns(0.999999);
		assert.notOk(geoService.isProperGeo(['non-PL-72/50']));
	});

	it('samples traffic with storing results in cache', () => {
		Math.random.returns(0.1);
		assert.ok(geoService.isProperGeo(['PL/50'], 'test'));
		assert.ok(geoService.isProperGeo(['PL/50'], 'A'));

		Math.random.returns(0.3);
		assert.ok(geoService.isProperGeo(['PL/50'], 'test'));
		assert.ok(geoService.isProperGeo(['PL/50'], 'B'));

		Math.random.returns(0.49);
		assert.ok(geoService.isProperGeo(['PL/50'], 'test'));
		assert.ok(geoService.isProperGeo(['PL/50'], 'C'));

		Math.random.returns(0.5);
		assert.ok(geoService.isProperGeo(['PL/50'], 'test'));
		assert.notOk(geoService.isProperGeo(['PL/50'], 'D'));

		Math.random.returns(0.9);
		assert.ok(geoService.isProperGeo(['PL/50'], 'test'));
		assert.notOk(geoService.isProperGeo(['PL/50'], 'E'));
	});

	it('samples only specific geos', () => {
		Math.random.returns(0.3);
		assert.notOk(geoService.isProperGeo(['PL-11/50']));

		Math.random.returns(0.3);
		assert.notOk(geoService.isProperGeo(['XX-ZZ/50']));

		Math.random.returns(0.3);
		assert.notOk(geoService.isProperGeo(['ZZ/50']));

		Math.random.returns(0.6);
		assert.notOk(geoService.isProperGeo(['ZZ/50']));

		Math.random.returns(0.9);
		assert.notOk(geoService.isProperGeo(['ZZ/50']));
	});

	it('samples fractions', () => {
		Math.random.returns(0.0009);
		assert.ok(geoService.isProperGeo(['PL/0.1']));

		Math.random.returns(0.001);
		assert.notOk(geoService.isProperGeo(['PL/0.1']));

		Math.random.returns(0.001);
		assert.ok(geoService.isProperGeo(['PL/0.2']));

		Math.random.returns(0.002);
		assert.notOk(geoService.isProperGeo(['PL/0.2']));

		Math.random.returns(0.003);
		assert.notOk(geoService.isProperGeo(['PL/0.2']));
	});

	it('returns cached values', () => {
		geoService.isProperGeo(['PL/50']);
		assert.deepEqual(geoService.getSamplingResults(), []);
		geoService.resetSamplingCache();

		Math.random.returns(0.5);
		assert.notOk(geoService.isProperGeo(['PL/10'], 'test'));
		assert.deepEqual(geoService.getSamplingResults(), ['test_A_90']);
		geoService.resetSamplingCache();

		Math.random.returns(0.01);
		assert.ok(geoService.isProperGeo(['PL/10'], 'test'));
		assert.deepEqual(geoService.getSamplingResults(), ['test_B_10']);
		geoService.resetSamplingCache();

		Math.random.returns(0.0001);
		assert.ok(geoService.isProperGeo(['PL/0.1'], 'test'));
		assert.deepEqual(geoService.getSamplingResults(), ['test_B_0.1']);
		geoService.resetSamplingCache();

		Math.random.returns(0.5);
		assert.notOk(geoService.isProperGeo(['PL/0.1'], 'test'));
		assert.deepEqual(geoService.getSamplingResults(), ['test_A_99.9']);
		geoService.resetSamplingCache();

		Math.random.returns(0.15);
		assert.ok(geoService.isProperGeo(['PL/25'], 'CAT'));
		assert.notOk(geoService.isProperGeo(['PL/10'], 'DOG'));
		assert.deepEqual(geoService.getSamplingResults(), ['CAT_B_25', 'DOG_A_90']);
		geoService.resetSamplingCache();
	});

	it('blocks sampled countries before sample', () => {
		Math.random.returns(0.15);
		assert.notOk(geoService.isProperGeo(['PL/25', 'non-PL'], 'test'));
	});

	it('eliminates JS floating point discrepancy', () => {
		Math.random.returns(0.8);
		geoService.isProperGeo(['PL/57'], 'TEST');
		assert.deepEqual(geoService.getSamplingResults(), ['TEST_A_43']);

		geoService.resetSamplingCache();

		Math.random.returns(0.3);
		geoService.isProperGeo(['PL/57'], 'TEST');
		assert.deepEqual(geoService.getSamplingResults(), ['TEST_B_57']);

		geoService.resetSamplingCache();

		Math.random.returns(0.56876436787446);
		geoService.isProperGeo(['PL/99.9'], 'TEST');
		assert.deepEqual(geoService.getSamplingResults(), ['TEST_B_99.9']);

		geoService.resetSamplingCache();

		Math.random.returns(0.9990001);
		geoService.isProperGeo(['PL/99.9'], 'TEST');
		assert.deepEqual(geoService.getSamplingResults(), ['TEST_A_0.1']);
	});

	it('supports small values (to 0.000001 precision)', () => {
		Math.random.returns(0.000000001);
		geoService.isProperGeo(['PL/0.000001'], 'TEST');
		assert.deepEqual(geoService.getSamplingResults(), ['TEST_B_0.000001']);

		geoService.resetSamplingCache();

		Math.random.returns(0.3);
		geoService.isProperGeo(['PL/0.000001'], 'TEST');
		assert.deepEqual(geoService.getSamplingResults(), ['TEST_A_99.999999']);
	});

	it('returns empty string if argument is undefined', () => {
		const result = geoService.mapSamplingResults();

		assert(Array.isArray(result));
		assert.equal(result.length, 0);
	});

	it('returns empty string if argument is an empty array', () => {
		const result = geoService.mapSamplingResults([]);

		assert(Array.isArray(result));
		assert.equal(result.length, 0);
	});

	it('selects dfp labrador keyvals', () => {
		const wfKeyVals = [
			'FOO_A_1:foo_a',
			'FOO_B_99:foo_b',
			'BAR_A_1:bar_a',
			'BAR_B_99:bar_b',
			'OOZ_A_1:ooz_a',
			'OOZ_B_99:ooz_b',
		];

		sinon.stub(geoService, 'getSamplingResults').returns(['FOO_A_1', 'BAR_B_99']);
		assert.deepEqual(geoService.mapSamplingResults(wfKeyVals), ['foo_a', 'bar_b']);
	});

	it('returns proper cached basset variables', () => {
		Cookies.get.returns(
			JSON.stringify({
				basset: {
					name: 'basset',
					group: 'B',
					limit: 50,
					result: true,
					withCookie: true,
				},
			}),
		);

		sessionCookie.setSessionId('test');
		geoService.resetStorage();

		Math.random.returns(1);
		assert.ok(geoService.isProperGeo(['PL/50-cached'], 'basset'));

		Math.random.returns(0);
		assert.ok(geoService.isProperGeo(['PL/50-cached'], 'basset'));
	});
});
