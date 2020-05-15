import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine';
import { iasPublisherOptimization } from '../../../src/ad-services';

describe('IAS Publisher Optimization', () => {
	const sandbox = createSandbox();
	let loadScriptStub;
	let clock;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		clock = sandbox.useFakeTimers();
		context.set('services.iasPublisherOptimization.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
		context.remove('services.iasPublisherOptimization.slots');
	});

	afterEach(() => {
		clock.tick(5);
		sandbox.restore();
	});

	it('IAS Publisher Optimization can be disabled', async () => {
		context.set('services.iasPublisherOptimization.enabled', false);

		await iasPublisherOptimization.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IAS Publisher Optimization is called', async () => {
		context.set('services.iasPublisherOptimization.enabled', true);
		context.set('services.iasPublisherOptimization.slots', ['top_leaderboard']);
		await iasPublisherOptimization.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(
			loadScriptStub.calledWith('//cdn.adsafeprotected.com/iasPET.1.js', 'text/javascript', true),
		).to.equal(true);
	});

	it('IAS Publisher Optimization is not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await iasPublisherOptimization.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IAS Publisher Optimization is not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await iasPublisherOptimization.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('IAS Publisher Optimization is not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await iasPublisherOptimization.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
