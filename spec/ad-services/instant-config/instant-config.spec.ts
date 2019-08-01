import { instantConfig } from '@wikia/ad-services/instant-config/instant-config.loader';
import { overrideInstantConfig } from '@wikia/ad-services/instant-config/instant-config.utils';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { utils } from '../../../src/ad-engine';

describe('Instant Config service', () => {
	const configPromise = Promise.resolve({
		foo: 'bar',
	});

	beforeEach(() => {
		const queryInstantGlobals = {
			'InstantGlobals.foo': 'bar',
			'InstantGlobals.bar': 'false',
			'InstantGlobals.oldGlobal': '[XX,PL/50,CZ/20-cached]',
		};

		instantConfig.configPromise = configPromise;
		sinon.stub(utils.queryString, 'getValues');
		utils.queryString.getValues.returns(queryInstantGlobals);
	});

	afterEach(() => {
		instantConfig.configPromise = null;
		utils.queryString.getValues.restore();
	});

	it('gets defined config', async () => {
		const value = await instantConfig.getConfig();

		expect(value).to.deep.equal({
			foo: 'bar',
		});
	});

	it('overrides config using query params', () => {
		const newConfig = overrideInstantConfig({
			foo: 'this value should be overridden',
			old: 'value',
		});

		expect(newConfig).to.deep.include({
			bar: false,
			foo: 'bar',
			old: 'value',
		});
		expect(newConfig['oldGlobal']).to.deep.equal(['XX', 'PL/50', 'CZ/20-cached']);
	});
});
