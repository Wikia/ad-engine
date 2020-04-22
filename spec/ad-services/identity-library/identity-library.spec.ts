import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine';
import { identityLibrary } from '../../../src/ad-services';

describe('IX Identity Library', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.remove('services.ixIdentityLibrary.enabled');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('IX Identity Library can be disabled', async () => {
		context.set('services.ixIdentityLibrary.enabled', false);

		await identityLibrary.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IX Identity Library is called', async () => {
		context.set('services.ixIdentityLibrary.enabled', true);
		await identityLibrary.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(
			loadScriptStub.calledWith(
				'//js-sec.indexww.com/ht/p/183085-19173550049191.js',
				'text/javascript',
				true,
			),
		).to.equal(true);
	});
});
