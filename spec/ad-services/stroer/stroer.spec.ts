import { Stroer } from '@wikia/ad-services';
import { InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';

describe('Stroer', () => {
	let stroer: Stroer;
	let loadScriptStub, instantConfigStub;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		stroer = new Stroer(instantConfigStub);
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
