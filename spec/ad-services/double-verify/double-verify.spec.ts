import { DoubleVerify } from '@wikia/ad-services';
import { context, InstantConfigService, targetingService, TargetingService } from '@wikia/core';
import { scriptLoader } from '@wikia/core/utils';
import { expect } from 'chai';
import sinon, { SinonStubbedInstance } from 'sinon';

describe('DoubleVerify', () => {
	let loadScriptStub, instantConfigStub;
	let doubleVerify: DoubleVerify;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;
	let fetchStub;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		targetingServiceStub = global.sandbox.stub(targetingService);

		context.extend({
			adUnitId: '/{slotConfig.adProduct}',
			options: {
				trackingOptIn: true,
				optOutSale: false,
			},
			slots: {
				top_leaderboard: {
					adProduct: 'top_leaderboard',
				},
				slot1: {
					adProduct: 'top_boxad',
				},
				slot2: {
					adProduct: 'incontent_leaderboard',
				},
				slot3: {
					adProduct: 'bottom_leaderboard',
				},
			},
		});
		window.fandomContext = {
			partners: { directedAtChildren: false },
		} as any;

		fetchStub = sinon.stub();
		fetchStub.resolves({
			status: 200,
		});
		globalThis.fetch = fetchStub;

		doubleVerify = new DoubleVerify(instantConfigStub);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		context.set('services.doubleVerify.slots', undefined);
	});

	it('DoubleVerify is disabled', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(false);

		await doubleVerify.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('DoubleVerify has empty configuration', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);

		await doubleVerify.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('DoubleVerify is ready', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);
		context.set('services.doubleVerify.slots', ['top_leaderboard']);

		await doubleVerify.call();

		expect(fetchStub.callCount).to.be.eq(1);
	});

	it('Prepare targeting', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);
		context.set('services.doubleVerify.slots', ['slot1', 'slot2', 'slot3']);

		const fakeResponse = {
			ok: true,
			json: global.sandbox.stub().resolves({
				IDS: '12345',
				BSC: 'bsc-data',
				ABS: 'abs-data',
				TVP: { '/top_boxad': { '': 'tvp-value1' }, '/bottom_leaderboard': { '': 'tvp-value3' } },
				VLP: { '/incontent_leaderboard': { '': 'vlp-value2' } },
			}),
		};

		fetchStub.onCall(0).resolves(fakeResponse);

		await doubleVerify.call();

		expect(fetchStub.callCount).to.be.eq(1);

		expect(targetingServiceStub.set.calledWith('ids', '12345')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('bsc', 'bsc-data')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('abs', 'abs-data')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('tvp', 'tvp-value1', 'slot1')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('tvp', 'tvp-value3', 'slot3')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('vlp', 'vlp-value2', 'slot2')).to.equal(true);
	});

	it('Default -1 values', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);
		context.set('services.doubleVerify.slots', ['top_leaderboard']);

		const fakeResponse = {
			ok: true,
			json: global.sandbox.stub().resolves({}),
		};

		fetchStub.onCall(0).resolves(fakeResponse);

		await doubleVerify.call();

		expect(targetingServiceStub.set.calledWith('ids', '-1')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('bsc', '-1')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('abs', '-1')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('tvp', '-1', 'top_leaderboard')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('vlp', '-1', 'top_leaderboard')).to.equal(true);
	});

	it('Prepare targeting - empty response', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);
		context.set('services.doubleVerify.slots', ['top_leaderboard']);

		const fakeResponse = {
			ok: true,
			json: global.sandbox.stub().resolves({}),
		};

		fetchStub.onCall(0).resolves(fakeResponse);

		await doubleVerify.call();

		expect(fetchStub.callCount).to.be.eq(1);
	});

	it('Check request', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);
		context.set('services.doubleVerify.slots', ['top_leaderboard']);

		await doubleVerify.call();

		expect(fetchStub.getCall(0).args[0]).to.be.eq(
			'https://pub.doubleverify.com/signals/pub.json?ctx=28150781&cmp=DV1001654&url=about%253Ablank&adunits%5B%2Ftop_leaderboard%5D%5B%5D=',
		);
	});
});
