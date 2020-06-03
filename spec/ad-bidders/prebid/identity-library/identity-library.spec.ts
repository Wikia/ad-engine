import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { identityLibrary } from '../../../../src/ad-bidders/prebid/identity-library';
import { context, utils } from '../../../../src/ad-engine';

describe('IX Identity Library', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.set('bidders.ixIdentityLibrary.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('IX Identity Library is called', async () => {
		await identityLibrary.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('IX Identity Library can be disabled', async () => {
		context.set('bidders.ixIdentityLibrary.enabled', false);

		await identityLibrary.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IX Identity Library not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await identityLibrary.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IX Identity Library not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await identityLibrary.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IX Identity Library not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await identityLibrary.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
