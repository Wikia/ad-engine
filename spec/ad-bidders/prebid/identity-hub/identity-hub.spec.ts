import { identityHubDeprecated } from '@wikia/ad-bidders';
import { context, utils } from '@wikia/ad-engine';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('Pubmatic IdentityHub', () => {
	const sandbox: SinonSandbox = createSandbox();
	let loadScriptSpy;
	let contextStub;

	beforeEach(() => {
		loadScriptSpy = sandbox.stub(utils.scriptLoader, 'loadScript');
		loadScriptSpy.resolvesThis();
		contextStub = sandbox.stub(context);
		contextStub.get.withArgs('pubmatic.identityHub.enabled').returns(true);
		contextStub.get.withArgs('options.optOutSale').returns(false);
		contextStub.get.withArgs('wiki.targeting.directedAtChildren').returns(false);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('pwt.js is called', async () => {
		await identityHubDeprecated.call();

		assert.calledOnce(loadScriptSpy);
	});

	it('IdentityHub is disabled by feature flag', async () => {
		contextStub.get.withArgs('pubmatic.identityHub.enabled').returns(false);

		await identityHubDeprecated.call();

		assert.notCalled(loadScriptSpy);
	});

	it('IdentityHub is disabled if user has opted out sale', async () => {
		contextStub.get.withArgs('options.optOutSale').returns(true);

		await identityHubDeprecated.call();

		assert.notCalled(loadScriptSpy);
	});

	it('IdentityHub is disabled on child-directed wiki', async () => {
		contextStub.get.withArgs('wiki.targeting.directedAtChildren').returns(true);

		await identityHubDeprecated.call();

		assert.notCalled(loadScriptSpy);
	});
});
