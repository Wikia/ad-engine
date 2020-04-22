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
		context.remove('services.iasPublisherOptimization.enabled');
		context.remove('services.iasPublisherOptimization.slots');
	});

	afterEach(() => {
		clock.tick(1);
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
});
