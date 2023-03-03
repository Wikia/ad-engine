import { Confiant } from '@wikia/ad-services';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';

describe('Confiant', () => {
	const DEFAULT_CONFIANT_LIB_URL =
		'//cdn.confiant-integrations.net/d-aIf3ibf0cYxCLB1HTWfBQOFEA/gpt_and_prebid/config.js';
	const TEST_CONFIANT_LIB_URL =
		'//cdn.confiant-integrations.net/TEST_PROPERTY_ID/gpt_and_prebid/config.js';

	let loadScriptStub, instantConfigStub;
	let confiant: Confiant;

	beforeEach(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));

		confiant = new Confiant(instantConfigStub);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		global.sandbox.restore();

		context.remove('services.confiant.propertyId');
	});

	it('Confiant is called when enabled', async () => {
		instantConfigStub.get.withArgs('icConfiant').returns(true);

		await confiant.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Confiant is loaded with default script', async () => {
		instantConfigStub.get.withArgs('icConfiant').returns(true);

		await confiant.call();

		expect(loadScriptStub.calledWith(DEFAULT_CONFIANT_LIB_URL)).to.equal(true);
	});

	it('Confiant is loaded with selected propertyId in the script URL', async () => {
		instantConfigStub.get.withArgs('icConfiant').returns(true);
		context.set('services.confiant.propertyId', 'TEST_PROPERTY_ID');

		await confiant.call();

		expect(loadScriptStub.calledWith(TEST_CONFIANT_LIB_URL)).to.equal(true);
	});

	it('Confiant is loaded with default propertyId when the context one is an empty string', async () => {
		instantConfigStub.get.withArgs('icConfiant').returns(true);
		context.set('services.confiant.propertyId', '');

		await confiant.call();

		expect(loadScriptStub.calledWith(DEFAULT_CONFIANT_LIB_URL)).to.equal(true);
	});

	it('Confiant is loaded with default propertyId when the context one is undefined', async () => {
		instantConfigStub.get.withArgs('icConfiant').returns(true);
		context.set('services.confiant.propertyId', undefined);

		await confiant.call();

		expect(loadScriptStub.calledWith(DEFAULT_CONFIANT_LIB_URL)).to.equal(true);
	});

	it('Confiant is not called when disabled', async () => {
		instantConfigStub.get.withArgs('icConfiant').returns(false);

		await confiant.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
