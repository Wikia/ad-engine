import { identityHub } from '@wikia/ad-bidders';
import { context, utils } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Pubmatic IdentityHub', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));

		context.set('pubmatic.identityHub.enabled', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
		context.set('wiki.opts.userEmailHashes', ['hash1', 'hash2', 'hash3']);
		context.set('state.isLogged', true);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('pwt.js is called', async () => {
		await identityHub.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('IdentityHub is disabled by feature flag', async () => {
		context.set('pubmatic.identityHub.enabled', false);

		await identityHub.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IdentityHub is disabled if user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await identityHub.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IdentityHub is disabled on child-directed wiki', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await identityHub.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IdentityHub is not loaded when there is no user email in context', async () => {
		context.set('wiki.opts.userEmailHashes', undefined);

		await identityHub.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
