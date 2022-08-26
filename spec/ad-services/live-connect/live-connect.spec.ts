import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine';
import { liveConnectDeprecated } from '../../../src/ad-services';

describe('LiveConnect', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.set('services.liveConnect.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Live Connect is called', async () => {
		await liveConnectDeprecated.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Live Connect can be disabled', async () => {
		context.set('services.liveConnect.enabled', false);

		await liveConnectDeprecated.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Live Connect not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await liveConnectDeprecated.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Live Connect not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await liveConnectDeprecated.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Live Connect not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await liveConnectDeprecated.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
