import { Audigent } from '@wikia/ad-services';
import {
	context,
	externalLogger,
	InstantConfigService,
	targetingService,
	utils,
} from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Audigent', () => {
	const sandbox = createSandbox();
	let audigent: Audigent;
	let loadScriptStub, externalLoggerLogStub, instantConfigStub;
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
		targetingService.set('AU_SEG', '-1');
		window['au_seg'] = undefined;

		audigent.setup();

		expect(targetingService.get('AU_SEG')).to.equal('-1');
	});

	it('Audigent key-val is set to no_segments when no segments from API', () => {
		window['au_seg'] = { segments: [] };

		audigent.setup();
		executeMockedCustomEvent([]);

		expect(targetingService.get('AU_SEG')).to.equal('no_segments');
	});

	it('Audigent key-val is set to given segments when API response with some', () => {
		const mockedSegments = ['AUG_SEG_TEST_1', 'AUG_AUD_TEST_1'];
		window['au_seg'] = { segments: mockedSegments };

		audigent.setup();
		executeMockedCustomEvent(mockedSegments);

		expect(targetingService.get('AU_SEG')).to.equal(mockedSegments);
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

		expect(targetingService.get('AU_SEG')).to.deep.equal(expectedSegements);
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

		expect(targetingService.get('AU_SEG')).to.deep.equal(mockedSegments);
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
