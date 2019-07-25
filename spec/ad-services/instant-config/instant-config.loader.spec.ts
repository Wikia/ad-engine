import { instantConfigLoader } from '@wikia/ad-services/instant-config/instant-config.loader';
import { overrideInstantConfig } from '@wikia/ad-services/instant-config/instant-config.utils';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { utils } from '../../../src/ad-engine';

describe('Instant Config service', () => {
	let getValuesStub: sinon.SinonStub;
	const configPromise = Promise.resolve({
		foo: 'bar',
	});

	beforeEach(() => {
		const queryInstantGlobals = {
			'InstantGlobals.foo': 'bar',
			'InstantGlobals.bar': 'false',
			'InstantGlobals.oldGlobal': '[XX,PL/50,CZ/20-cached]',
		};

		instantConfigLoader.configPromise = configPromise;
		getValuesStub = sinon.stub(utils.queryString, 'getValues');
		getValuesStub.returns(queryInstantGlobals);
	});

	afterEach(() => {
		instantConfigLoader.configPromise = null;
		getValuesStub.restore();
	});

	it('gets defined config', async () => {
		const value = await instantConfigLoader.getConfig();

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
