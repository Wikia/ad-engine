import { DoubleVerify } from '@wikia/ad-services';
import { InstantConfigService, targetingService, TargetingService, utils } from '@wikia/core';
import { expect } from 'chai';
import sinon, { SinonStubbedInstance } from 'sinon';

describe('DoubleVerify', () => {
	let loadScriptStub, instantConfigStub;
	let doubleVerify: DoubleVerify;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;
	let fetchStub;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		targetingServiceStub = global.sandbox.stub(targetingService);

		fetchStub = sinon.stub();
		fetchStub.resolves({
			status: 200,
		});
		globalThis.fetch = fetchStub;

		doubleVerify = new DoubleVerify(instantConfigStub);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
	});

	it('DoubleVerify is disabled', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(false);

		await doubleVerify.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('DoubleVerify is ready', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);

		await doubleVerify.call();

		expect(fetchStub.callCount).to.be.eq(1);
	});

	it('Prepare targeting', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);

		const fakeResponse = {
			ok: true,
			json: global.sandbox.stub().resolves({
				IDS: '12345',
				BSC: 'bsc-data',
				ABC: 'abc-data',
				TVP: { slot1: { '': 'tvp-value1' }, slot3: { '': 'tvp-value3' } },
				VLP: { slot2: { '': 'vlp-value2' } },
			}),
		};

		fetchStub.onCall(0).resolves(fakeResponse);

		await doubleVerify.call();

		expect(fetchStub.callCount).to.be.eq(1);

		expect(targetingServiceStub.set.calledWith('ids', '12345')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('bsc', 'bsc-data')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('abs', 'abc-data')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('tvp', 'tvp-value1', 'slot1')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('tvp', 'tvp-value3', 'slot3')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('vlp', 'vlp-value2', 'slot2')).to.equal(true);
	});

	it('Prepare targeting - empty response', async () => {
		instantConfigStub.get.withArgs('icDoubleVerify').returns(true);

		const fakeResponse = {
			ok: true,
			json: global.sandbox.stub().resolves({}),
		};

		fetchStub.onCall(0).resolves(fakeResponse);

		await doubleVerify.call();

		expect(fetchStub.callCount).to.be.eq(1);
	});
});
