import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/core';
import { iasPublisherOptimization } from '../../../src/ad-services';

describe('IAS Publisher Optimization', () => {
	const sandbox = createSandbox();
	const iasData =
		'{"brandSafety":' +
		'{"adt":"veryLow",' +
		'"alc":"medium",' +
		'"dlm":"veryLow",' +
		'"drg":"high",' +
		'"hat":"veryLow",' +
		'"off":"medium",' +
		'"vio":"veryLow"},' +
		'"custom": {' +
		'"ias-kw": ["IAS_12345", "IAS_67890"]' +
		'},' +
		'"fr":"false",' +
		'"slots":{"top_leaderboard":{"id":"68f5088c-9c44-11eb-b40e","grm":["40"],"vw":"false"}}}';
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

	it('IAS Publisher Optimization is called', async () => {
		context.set('services.iasPublisherOptimization.enabled', true);
		context.set('services.iasPublisherOptimization.slots', ['top_leaderboard']);
		await iasPublisherOptimization.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(
			loadScriptStub.calledWith('//cdn.adsafeprotected.com/iasPET.1.js', 'text/javascript', true),
		).to.equal(true);
	});

	it('IAS Publisher Optimization properly updates a targeting', async () => {
		context.set('services.iasPublisherOptimization.enabled', true);
		context.set('services.iasPublisherOptimization.slots', ['top_leaderboard']);
		await iasPublisherOptimization.call();

		window.__iasPET.queue[0].dataHandler(iasData);

		expect(context.get('targeting.fr')).to.equal('false');
		expect(context.get('targeting.adt')).to.equal('veryLow');
		expect(context.get('targeting.alc')).to.equal('medium');
		expect(context.get('targeting.dlm')).to.equal('veryLow');
		expect(context.get('targeting.drg')).to.equal('high');
		expect(context.get('targeting.hat')).to.equal('veryLow');
		expect(context.get('targeting.off')).to.equal('medium');
		expect(context.get('targeting.vio')).to.equal('veryLow');
		expect(context.get('targeting.b_ias')).to.equal('high');
		expect(context.get('targeting.ias-kw')).to.deep.equal(['IAS_12345', 'IAS_67890']);
		expect(context.get('slots.top_leaderboard.targeting.vw')).to.equal('false');
	});
});
