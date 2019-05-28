import { expect } from 'chai';
import * as sinon from 'sinon';
import { utils } from '../../../src/ad-engine';
import { instantConfig, overrideInstantConfig } from '../../../src/ad-services/instant-config';

describe('Instant Config service', () => {
	const config = {
		foo: 'bar',
	};

	beforeEach(() => {
		const queryInstantGlobals = {
			'InstantGlobals.foo': 'bar',
			'InstantGlobals.bar': 'false',
		};

		instantConfig.config = config;
		sinon.stub(utils.queryString, 'getValues');
		utils.queryString.getValues.returns(queryInstantGlobals);
	});

	afterEach(() => {
		instantConfig.config = null;
		utils.queryString.getValues.restore();
	});

	it('gets defined config', async () => {
		const value = await instantConfig.getConfig();

		expect(value).to.equal(config);
	});

	it('gets single value from config', async () => {
		const value = await instantConfig.get('foo');

		expect(value).to.equal('bar');
	});

	it('overrides config using query params', () => {
		const newConfig = overrideInstantConfig({
			foo: 'this value should be overridden',
			old: 'value',
		});

		expect(newConfig).to.deep.equal({
			bar: false,
			foo: 'bar',
			old: 'value',
		});
	});
});
