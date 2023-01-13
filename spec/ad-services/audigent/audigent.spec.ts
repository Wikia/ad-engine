import { Audigent } from '@wikia/ad-services';
import {
	context,
	externalLogger,
	InstantConfigService,
	TargetingService,
	targetingService,
	utils,
} from '@wikia/core';
import { expect } from 'chai';
import { createSandbox, SinonStubbedInstance } from 'sinon';

describe('Audigent', () => {
	const sandbox = createSandbox();
	let audigent: Audigent;
	let loadScriptStub, externalLoggerLogStub, instantConfigStub;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	function executeMockedCustomEvent(segments) {
		const auSegEvent = new CustomEvent('auSegReady', { detail: segments });
		document.dispatchEvent(auSegEvent);
	}

	beforeEach(() => {
		loadScriptStub = sandbox.spy(utils.scriptLoader, 'loadScript');
		externalLoggerLogStub = sandbox.stub(externalLogger, 'log').returns({} as any);
		instantConfigStub = sandbox.createStubInstance(InstantConfigService);
		instantConfigStub.get.withArgs('icAudigent').returns(true);
		instantConfigStub.get.withArgs('icAudigentTrackingSampling').returns(0);

		targetingServiceStub = sandbox.stub(targetingService);

		audigent = new Audigent(instantConfigStub);

		window['au_seg'] = [];

		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);

		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		instantConfigStub.get.withArgs('icAudigent').returns(undefined);
		instantConfigStub.get.withArgs('icAudigentSegmentLimit').returns(undefined);
		instantConfigStub.get.withArgs('icAudigentTrackingSampling').returns(undefined);

		sandbox.restore();
		loadScriptStub.resetHistory();
		audigent.resetLoadedState();

		window['au_seg'] = undefined;

		context.set('options.trackingOptIn', undefined);
		context.set('options.optOutSale', undefined);

		context.set('wiki.targeting.directedAtChildren', undefined);
	});

	it('Audigent is called', async () => {
		await audigent.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Audigent can be disabled', async () => {
		instantConfigStub.get.withArgs('icAudigent').returns(false);

		await audigent.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Audigent not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await audigent.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Audigent not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await audigent.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Audigent not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await audigent.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Audigent requests for two assets when integration is enabled', async () => {
		Audigent.loadSegmentLibrary();
		await audigent.call();

		expect(loadScriptStub.callCount).to.equal(2);
	});

	it('Audigent key-val is set to -1 when API is too slow', () => {
		targetingServiceStub.get.withArgs('AU_SEG').returns('-1');
		window['au_seg'] = undefined;

		audigent.setup();

		expect(targetingServiceStub.set.called).to.be.false;
	});

	it('Audigent key-val is set to no_segments when no segments from API', () => {
		window['au_seg'] = { segments: [] };

		audigent.setup();
		executeMockedCustomEvent([]);

		expect(targetingServiceStub.set.calledWith('AU_SEG', 'no_segments')).to.equal(true);
	});

	it('Audigent key-val is set to given segments when API response with some', () => {
		const mockedSegments = ['AUG_SEG_TEST_1', 'AUG_AUD_TEST_1'];
		window['au_seg'] = { segments: mockedSegments };

		audigent.setup();
		executeMockedCustomEvent(mockedSegments);

		expect(targetingServiceStub.set.calledWith('AU_SEG', mockedSegments)).to.equal(true);
	});

	it('Audigent key-val length keeps the limit', async () => {
		instantConfigStub.get.withArgs('icAudigentSegmentLimit').returns(6);

		const mockedSegments = [
			'AUG_SEG_TEST_1',
			'AUG_SEG_TEST_2',
			'AUG_SEG_TEST_3',
			'AUG_SEG_TEST_4',
			'AUG_SEG_TEST_5',
			'AUG_AUD_TEST_1',
			'AUG_AUD_TEST_2',
			'AUG_AUD_TEST_3',
			'AUG_AUD_TEST_4',
			'AUG_AUD_TEST_5',
		];
		const expectedSegements = [
			'AUG_SEG_TEST_1',
			'AUG_SEG_TEST_2',
			'AUG_SEG_TEST_3',
			'AUG_SEG_TEST_4',
			'AUG_SEG_TEST_5',
			'AUG_AUD_TEST_1',
		];
		window['au_seg'] = { segments: mockedSegments };

		await audigent.call();
		audigent.setup();
		executeMockedCustomEvent(mockedSegments);

		expect(targetingServiceStub.set.calledWith('AU_SEG', expectedSegements)).to.equal(true);
	});

	it('Audigent key-val length ignores limit if it is higher than returned segments', async () => {
		instantConfigStub.get.withArgs('icAudigentSegmentLimit').returns(20);

		const mockedSegments = [
			'AUG_SEG_TEST_1',
			'AUG_SEG_TEST_2',
			'AUG_SEG_TEST_3',
			'AUG_SEG_TEST_4',
			'AUG_SEG_TEST_5',
			'AUG_AUD_TEST_1',
			'AUG_AUD_TEST_2',
			'AUG_AUD_TEST_3',
			'AUG_AUD_TEST_4',
			'AUG_AUD_TEST_5',
		];
		window['au_seg'] = { segments: mockedSegments };

		await audigent.call();
		audigent.setup();
		executeMockedCustomEvent(mockedSegments);

		expect(targetingServiceStub.set.calledWith('AU_SEG', mockedSegments)).to.equal(true);
	});

	it('Audigent does not send data to Kibana when no segments', () => {
		audigent.setup();

		expect(externalLoggerLogStub.called).to.equal(false);
	});

	it('Audigent does not send data to Kibana when sampled set to 0', async () => {
		instantConfigStub.get.withArgs('icAudigentTrackingSampling').returns(0);

		const mockedSegments = ['AUG_SEG_TEST_1'];
		window['au_seg'] = { segments: mockedSegments };
		await audigent.call();
		audigent.setup();

		expect(externalLoggerLogStub.called).to.equal(false);
	});

	it('Audigent sends data to Kibana when sampled correctly', async () => {
		instantConfigStub.get.withArgs('icAudigentTrackingSampling').returns(100);

		const mockedSegments = ['AUG_SEG_TEST_1'];
		window['au_seg'] = { segments: mockedSegments };
		await audigent.call();
		audigent.setup();
		executeMockedCustomEvent(mockedSegments);

		expect(externalLoggerLogStub.called).to.equal(true);
	});
});
