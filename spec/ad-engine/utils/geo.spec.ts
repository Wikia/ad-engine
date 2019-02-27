import { assert } from 'chai';
import Cookies from 'js-cookie';
import * as sinon from 'sinon';
import * as geo from '../../../src/ad-engine/utils/geo';
import Random from '../../../src/ad-engine/utils/random';

describe('Geo', () => {
	let sandbox;

	beforeEach(() => {
		geo.setGeoData({
			city: 'Poznan',
			country: 'PL',
			continent: 'EU',
			region: '72',
		});

		sandbox = sinon.sandbox.create();
		sandbox.stub(Random, 'getRandom');
		sandbox.stub(Cookies, 'get');
	});

	afterEach(() => {
		geo.resetSamplingCache();
		sandbox.restore();
	});

	it('returns country and continent code', () => {
		assert.equal(geo.getCountryCode(), 'PL');
		assert.equal(geo.getContinentCode(), 'EU');
	});

	it('returns region code', () => {
		assert.equal(geo.getRegionCode(), '72');
	});

	it('geo.isProperGeo test empty', () => {
		assert.notOk(geo.isProperGeo());
	});

	it('geo.isProperGeo test - region', () => {
		// Region
		assert.ok(geo.isProperGeo(['PL-72']));
		assert.ok(geo.isProperGeo(['ZZ', 'PL-72', 'non-PL-33']));
		assert.notOk(geo.isProperGeo(['ZZ', 'PL-33']));
		assert.notOk(geo.isProperGeo(['non-PL-72']));
		assert.notOk(geo.isProperGeo(['ZZ', 'non-PL-72']));
		assert.notOk(geo.isProperGeo(['ZZ', 'PL-72', 'non-PL-72']));
	});

	it('geo.isProperGeo test - country', () => {
		assert.ok(geo.isProperGeo(['PL']));
		assert.ok(geo.isProperGeo(['ZZ', 'PL', 'non-YY']));
		assert.notOk(geo.isProperGeo(['ZZ', 'YY']));
		assert.notOk(geo.isProperGeo(['non-PL']));
		assert.notOk(geo.isProperGeo(['ZZ', 'non-PL']));
		assert.notOk(geo.isProperGeo(['ZZ', 'PL', 'non-PL']));
	});

	it('geo.isProperGeo test - continent', () => {
		assert.ok(geo.isProperGeo(['XX-EU']));
		assert.ok(geo.isProperGeo(['XX-NA', 'XX-EU', 'non-XX-SA']));
		assert.notOk(geo.isProperGeo(['XX-NA', 'XX-SA']));
		assert.notOk(geo.isProperGeo(['XX-NA', 'XX-SA', 'non-XX-EU']));
		assert.notOk(geo.isProperGeo(['XX-NA', 'XX-EU', 'non-XX-EU']));
		assert.notOk(geo.isProperGeo(['non-XX-EU']));
	});

	it('geo.isProperGeo test - earth', () => {
		assert.ok(geo.isProperGeo(['XX']));
		assert.ok(geo.isProperGeo(['XX', 'non-PL-33']));
		assert.notOk(geo.isProperGeo(['XX', 'non-PL-72']));
		assert.ok(geo.isProperGeo(['XX', 'non-DE']));
		assert.notOk(geo.isProperGeo(['XX', 'non-PL']));
		assert.ok(geo.isProperGeo(['XX', 'non-XX-SA']));
		assert.notOk(geo.isProperGeo(['XX', 'non-XX-EU']));
	});

	it('samples traffic for earth', () => {
		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['XX/100']));

		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['XX/50']));

		Random.getRandom.returns(0.1);
		assert.ok(geo.isProperGeo(['XX/50']));

		Random.getRandom.returns(0.1);
		assert.notOk(geo.isProperGeo(['non-XX/50']));

		Random.getRandom.returns(0.49);
		assert.ok(geo.isProperGeo(['XX/50']));

		Random.getRandom.returns(0.499999);
		assert.ok(geo.isProperGeo(['XX/50']));

		Random.getRandom.returns(0.5);
		assert.notOk(geo.isProperGeo(['XX/50']));

		Random.getRandom.returns(0.6);
		assert.notOk(geo.isProperGeo(['XX/50']));

		Random.getRandom.returns(0.8);
		assert.notOk(geo.isProperGeo(['XX/50']));

		Random.getRandom.returns(0.99);
		assert.notOk(geo.isProperGeo(['XX/50']));

		Random.getRandom.returns(0.999999);
		assert.notOk(geo.isProperGeo(['XX/50']));
	});

	it('samples traffic for continent', () => {
		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['XX-EU/100']));

		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['XX-EU/50']));

		Random.getRandom.returns(0.1);
		assert.ok(geo.isProperGeo(['XX-EU/50']));

		Random.getRandom.returns(0.1);
		assert.notOk(geo.isProperGeo(['non-XX-EU/50']));

		Random.getRandom.returns(0.49);
		assert.ok(geo.isProperGeo(['XX-EU/50']));

		Random.getRandom.returns(0.499999);
		assert.ok(geo.isProperGeo(['XX-EU/50']));

		Random.getRandom.returns(0.5);
		assert.notOk(geo.isProperGeo(['XX-EU/50']));

		Random.getRandom.returns(0.6);
		assert.notOk(geo.isProperGeo(['XX-EU/50']));

		Random.getRandom.returns(0.8);
		assert.notOk(geo.isProperGeo(['XX-EU/50']));

		Random.getRandom.returns(0.99);
		assert.notOk(geo.isProperGeo(['XX-EU/50']));

		Random.getRandom.returns(0.999999);
		assert.notOk(geo.isProperGeo(['XX-EU/50']));
	});

	it('samples traffic for country', () => {
		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['PL/100']));

		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.1);
		assert.ok(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.1);
		assert.notOk(geo.isProperGeo(['non-PL/50']));

		Random.getRandom.returns(0.49);
		assert.ok(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.499999);
		assert.ok(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.5);
		assert.notOk(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.6);
		assert.notOk(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.8);
		assert.notOk(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.99);
		assert.notOk(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.999999);
		assert.notOk(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.999999);
		assert.notOk(geo.isProperGeo(['PL/50']));

		Random.getRandom.returns(0.999999);
		assert.notOk(geo.isProperGeo(['non-PL/50']));
	});

	it('samples traffic for region', () => {
		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['PL-72/100']));

		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.1);
		assert.ok(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.1);
		assert.notOk(geo.isProperGeo(['non-PL-72/50']));

		Random.getRandom.returns(0.49);
		assert.ok(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.5);
		assert.notOk(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.6);
		assert.notOk(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.8);
		assert.notOk(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.99);
		assert.notOk(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.999999);
		assert.notOk(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.999999);
		assert.notOk(geo.isProperGeo(['PL-72/50']));

		Random.getRandom.returns(0.999999);
		assert.notOk(geo.isProperGeo(['non-PL-72/50']));
	});

	it('samples traffic with storing results in cache', () => {
		Random.getRandom.returns(0.1);
		assert.ok(geo.isProperGeo(['PL/50'], 'test'));
		assert.ok(geo.isProperGeo(['PL/50'], 'A'));

		Random.getRandom.returns(0.3);
		assert.ok(geo.isProperGeo(['PL/50'], 'test'));
		assert.ok(geo.isProperGeo(['PL/50'], 'B'));

		Random.getRandom.returns(0.49);
		assert.ok(geo.isProperGeo(['PL/50'], 'test'));
		assert.ok(geo.isProperGeo(['PL/50'], 'C'));

		Random.getRandom.returns(0.5);
		assert.ok(geo.isProperGeo(['PL/50'], 'test'));
		assert.notOk(geo.isProperGeo(['PL/50'], 'D'));

		Random.getRandom.returns(0.9);
		assert.ok(geo.isProperGeo(['PL/50'], 'test'));
		assert.notOk(geo.isProperGeo(['PL/50'], 'E'));
	});

	it('samples only specific geos', () => {
		Random.getRandom.returns(0.3);
		assert.notOk(geo.isProperGeo(['PL-11/50']));

		Random.getRandom.returns(0.3);
		assert.notOk(geo.isProperGeo(['XX-ZZ/50']));

		Random.getRandom.returns(0.3);
		assert.notOk(geo.isProperGeo(['ZZ/50']));

		Random.getRandom.returns(0.6);
		assert.notOk(geo.isProperGeo(['ZZ/50']));

		Random.getRandom.returns(0.9);
		assert.notOk(geo.isProperGeo(['ZZ/50']));
	});

	it('samples fractions', () => {
		Random.getRandom.returns(0.0009);
		assert.ok(geo.isProperGeo(['PL/0.1']));

		Random.getRandom.returns(0.001);
		assert.notOk(geo.isProperGeo(['PL/0.1']));

		Random.getRandom.returns(0.001);
		assert.ok(geo.isProperGeo(['PL/0.2']));

		Random.getRandom.returns(0.002);
		assert.notOk(geo.isProperGeo(['PL/0.2']));

		Random.getRandom.returns(0.003);
		assert.notOk(geo.isProperGeo(['PL/0.2']));
	});

	it('returns cached values', () => {
		geo.isProperGeo(['PL/50']);
		assert.deepEqual(geo.getSamplingResults(), []);
		geo.resetSamplingCache();

		Random.getRandom.returns(0.5);
		assert.notOk(geo.isProperGeo(['PL/10'], 'test'));
		assert.deepEqual(geo.getSamplingResults(), ['test_A_90']);
		geo.resetSamplingCache();

		Random.getRandom.returns(0.01);
		assert.ok(geo.isProperGeo(['PL/10'], 'test'));
		assert.deepEqual(geo.getSamplingResults(), ['test_B_10']);
		geo.resetSamplingCache();

		Random.getRandom.returns(0.0001);
		assert.ok(geo.isProperGeo(['PL/0.1'], 'test'));
		assert.deepEqual(geo.getSamplingResults(), ['test_B_0.1']);
		geo.resetSamplingCache();

		Random.getRandom.returns(0.5);
		assert.notOk(geo.isProperGeo(['PL/0.1'], 'test'));
		assert.deepEqual(geo.getSamplingResults(), ['test_A_99.9']);
		geo.resetSamplingCache();

		Random.getRandom.returns(0.15);
		assert.ok(geo.isProperGeo(['PL/25'], 'CAT'));
		assert.notOk(geo.isProperGeo(['PL/10'], 'DOG'));
		assert.deepEqual(geo.getSamplingResults(), ['CAT_B_25', 'DOG_A_90']);
		geo.resetSamplingCache();
	});

	it('blocks sampled countries before sample', () => {
		Random.getRandom.returns(0.15);
		assert.notOk(geo.isProperGeo(['PL/25', 'non-PL'], 'test'));
	});

	it('eliminates JS floating point discrepancy', () => {
		Random.getRandom.returns(0.8);
		geo.isProperGeo(['PL/57'], 'TEST');
		assert.deepEqual(geo.getSamplingResults(), ['TEST_A_43']);

		geo.resetSamplingCache();

		Random.getRandom.returns(0.3);
		geo.isProperGeo(['PL/57'], 'TEST');
		assert.deepEqual(geo.getSamplingResults(), ['TEST_B_57']);

		geo.resetSamplingCache();

		Random.getRandom.returns(0.56876436787446);
		geo.isProperGeo(['PL/99.9'], 'TEST');
		assert.deepEqual(geo.getSamplingResults(), ['TEST_B_99.9']);

		geo.resetSamplingCache();

		Random.getRandom.returns(0.9990001);
		geo.isProperGeo(['PL/99.9'], 'TEST');
		assert.deepEqual(geo.getSamplingResults(), ['TEST_A_0.1']);
	});

	it('supports small values (to 0.000001 precision)', () => {
		Random.getRandom.returns(0.000000001);
		geo.isProperGeo(['PL/0.000001'], 'TEST');
		assert.deepEqual(geo.getSamplingResults(), ['TEST_B_0.000001']);

		geo.resetSamplingCache();

		Random.getRandom.returns(0.3);
		geo.isProperGeo(['PL/0.000001'], 'TEST');
		assert.deepEqual(geo.getSamplingResults(), ['TEST_A_99.999999']);
	});

	it('returns empty string if argument is undefined', () => {
		const result = geo.mapSamplingResults();

		assert(Array.isArray(result));
		assert.equal(result.length, 0);
	});

	it('returns empty string if argument is an empty array', () => {
		const result = geo.mapSamplingResults([]);

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

		sinon.stub(geo.default, 'getSamplingResults').returns(['FOO_A_1', 'BAR_B_99']);
		assert.equal(geo.mapSamplingResults(wfKeyVals), 'foo_a,bar_b');
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

		geo.setSessionId('test');
		Random.getRandom.returns(1);
		assert.ok(geo.isProperGeo(['PL/50-cached'], 'basset'));

		Random.getRandom.returns(0);
		assert.ok(geo.isProperGeo(['PL/50-cached'], 'basset'));
	});
});
