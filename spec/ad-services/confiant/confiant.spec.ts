import { Confiant } from '@wikia/ad-services';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Confiant', () => {
	const DEFAULT_CONFIANT_LIB =
		'//cdn.confiant-integrations.net/d-aIf3ibf0cYxCLB1HTWfBQOFEA/gpt_and_prebid/config.js';

	const sandbox = createSandbox();

	let loadScriptStub, instantConfigStub;
	let confiant: Confiant;

	beforeEach(() => {
		instantConfigStub = sandbox.createStubInstance(InstantConfigService);

		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));

		confiant = new Confiant(instantConfigStub);
	});

	afterEach(() => {
		sandbox.restore();
		loadScriptStub.resetHistory();

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

		expect(loadScriptStub.calledWith(DEFAULT_CONFIANT_LIB)).to.equal(true);
	});

	it('Confiant is not called when disabled', async () => {
		instantConfigStub.get.withArgs('icConfiant').returns(false);

		await confiant.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
