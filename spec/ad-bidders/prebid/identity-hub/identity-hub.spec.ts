import { IdentityHub } from '@wikia/ad-bidders';
import { context, InstantConfigService, utils } from '@wikia/core';
import { assert } from 'sinon';

describe('Pubmatic IdentityHub', () => {
	let identityHub;
	let loadScriptSpy;
	let contextStub, instantConfigStub;

	beforeEach(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		loadScriptSpy = global.sandbox.stub(utils.scriptLoader, 'loadScript');
		loadScriptSpy.resolvesThis();
		contextStub = global.sandbox.stub(context);
		contextStub.get.withArgs('bidders.identityHub.enabled').returns(true);
		contextStub.get.withArgs('options.trackingOptIn').returns(true);
		contextStub.get.withArgs('options.optOutSale').returns(false);
		contextStub.get.withArgs('wiki.targeting.directedAtChildren').returns(false);

		identityHub = new IdentityHub(instantConfigStub);
	});

	afterEach(() => {
		delete window.fandomContext.partners.directedAtChildren;
	});

	it('pwt.js is called', async () => {
		await identityHub.call();

		assert.calledOnce(loadScriptSpy);
	});

	it('IdentityHub is disabled by feature flag', async () => {
		contextStub.get.withArgs('bidders.identityHub.enabled').returns(false);

		await identityHub.call();

		assert.notCalled(loadScriptSpy);
	});

	it('IdentityHub is disabled if user has opted out sale', async () => {
		contextStub.get.withArgs('options.optOutSale').returns(true);

		await identityHub.call();

		assert.notCalled(loadScriptSpy);
	});

	it('IdentityHub is disabled on child-directed wiki', async () => {
		contextStub.get.withArgs('wiki.targeting.directedAtChildren').returns(true);
		window.fandomContext.partners.directedAtChildren = true;

		await identityHub.call();

		assert.notCalled(loadScriptSpy);
	});
});
