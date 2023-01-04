import { Stroer } from '@wikia/ad-services';
import { InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Stroer', () => {
	const sandbox = createSandbox();
	let stroer: Stroer;
	let loadScriptStub, instantConfigStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = sandbox.createStubInstance(InstantConfigService);
		stroer = new Stroer(instantConfigStub);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Stroer is created', async () => {
		instantConfigStub.get.withArgs('icStroer').returns(true);

		await stroer.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Stroer is disabled', async () => {
		instantConfigStub.get.withArgs('icStroer').returns(false);

		await stroer.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
