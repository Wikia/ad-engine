import { IasPublisherOptimization } from '@wikia/ad-services';
import { context, InstantConfigService, targetingService, utils } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox, spy } from 'sinon';

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
	let iasPublisherOptimization: IasPublisherOptimization;
	let loadScriptStub, instantConfigStub;
	let clock;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = sandbox.createStubInstance(InstantConfigService);
		instantConfigStub.get.withArgs('icIASPublisherOptimization').returns(true);

		clock = sandbox.useFakeTimers();
		iasPublisherOptimization = new IasPublisherOptimization(instantConfigStub);

		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
		context.remove('services.iasPublisherOptimization.slots');

		window.googletag = {
			enableServices: spy(),
		} as any;
		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push = ((cb) => {
			cb();
		}) as any;
	});

	afterEach(() => {
		clock.tick(5);
		sandbox.restore();
	});

	it('IAS Publisher Optimization can be disabled', async () => {
		instantConfigStub.get.withArgs('icIASPublisherOptimization').returns(false);

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
		context.set('services.iasPublisherOptimization.slots', ['top_leaderboard']);
		await iasPublisherOptimization.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(
			loadScriptStub.calledWith('//cdn.adsafeprotected.com/iasPET.1.js', 'text/javascript', true),
		).to.equal(true);
	});

	it('IAS Publisher Optimization properly updates a targeting', async () => {
		context.set('services.iasPublisherOptimization.slots', ['top_leaderboard']);
		await iasPublisherOptimization.call();

		window.__iasPET.queue[0].dataHandler(iasData);

		expect(targetingService.get('fr')).to.equal('false');
		expect(targetingService.get('adt')).to.equal('veryLow');
		expect(targetingService.get('alc')).to.equal('medium');
		expect(targetingService.get('dlm')).to.equal('veryLow');
		expect(targetingService.get('drg')).to.equal('high');
		expect(targetingService.get('hat')).to.equal('veryLow');
		expect(targetingService.get('off')).to.equal('medium');
		expect(targetingService.get('vio')).to.equal('veryLow');
		expect(targetingService.get('b_ias')).to.equal('high');
		expect(targetingService.get('ias-kw')).to.deep.equal(['IAS_12345', 'IAS_67890']);
		expect(targetingService.get('vw', 'top_leaderboard')).to.equal('false');
	});
});
