import { identityHub } from '@wikia/ad-bidders';
import { context, utils } from '@wikia/ad-engine';
import { assert, createSandbox } from 'sinon';

describe('Pubmatic IdentityHub', () => {
	const sandbox = createSandbox();
	let loadScriptSpy;

	beforeEach(() => {
		loadScriptSpy = sandbox.stub(utils.scriptLoader, 'loadScript');
		loadScriptSpy.resolvesThis();

		context.set('pubmatic.identityHub.enabled', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
		context.set('state.isLogged', true);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('pwt.js is called', async () => {
		await identityHub.call();

		assert.calledOnce(loadScriptSpy);
	});

	it('IdentityHub is disabled by feature flag', async () => {
		context.set('pubmatic.identityHub.enabled', false);

		await identityHub.call();

		assert.notCalled(loadScriptSpy);
	});

	it('IdentityHub is disabled if user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await identityHub.call();

		assert.notCalled(loadScriptSpy);
	});

	it('IdentityHub is disabled on child-directed wiki', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await identityHub.call();

		assert.notCalled(loadScriptSpy);
	});
});
