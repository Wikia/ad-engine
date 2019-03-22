import { btfBlockerService, context, Dictionary, SlotConfig } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox, spy } from 'sinon';
import adSlotFake from '../ad-slot-fake';

let firstCallSlot;
let secondCallSlot;
let onRenderEndedCallback;
let sandbox;
let slotConfigs: Dictionary<SlotConfig>;

describe('btf-blocker-service', () => {
	beforeEach(() => {
		sandbox = createSandbox();
		sandbox.stub(context, 'push').callsFake((key, callbacks) => {
			onRenderEndedCallback = callbacks.onRenderEnded;
		});

		const originalGet = context.get;
		sandbox.stub(context, 'get').callsFake((key) => {
			if (key === 'slots') {
				return slotConfigs;
			}

			return originalGet(key);
		});

		window.ads = {
			runtime: {},
		};

		firstCallSlot = {
			...adSlotFake,
			name: 'A',
			config: {
				...adSlotFake.config,
				firstCall: true,
			},
		};
		secondCallSlot = {
			...adSlotFake,
			name: 'B',
			config: {
				...adSlotFake.config,
				firstCall: false,
			},
		};
		slotConfigs = {};
		slotConfigs[firstCallSlot.getSlotName()] = { ...firstCallSlot.config };
		slotConfigs[secondCallSlot.getSlotName()] = { ...secondCallSlot.config };

		btfBlockerService.resetState();
		btfBlockerService.init();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should fill in first call slot', () => {
		const fillInSpy = spy();

		btfBlockerService.push(firstCallSlot, fillInSpy);

		expect(fillInSpy.called).to.be.ok;
	});

	it('should not fill in second call slot without first call called', () => {
		const fillInSpy = spy();

		btfBlockerService.push(secondCallSlot, fillInSpy);

		expect(fillInSpy.called).to.not.be.ok;
	});

	it('should not fill in second call slot until first call rendered', () => {
		const firstCallFillInSpy = spy();
		const secondCallFillInSpy = spy();

		btfBlockerService.push(firstCallSlot, firstCallFillInSpy);
		btfBlockerService.push(secondCallSlot, secondCallFillInSpy);

		expect(firstCallFillInSpy.called).to.be.ok;
		expect(secondCallFillInSpy.called).to.not.be.ok;
	});

	it('should fill in second call slot after first call slot is rendered', () => {
		const firstCallFillInSpy = spy();
		const secondCallFillInSpy = spy();

		btfBlockerService.push(firstCallSlot, firstCallFillInSpy);
		btfBlockerService.push(secondCallSlot, secondCallFillInSpy);

		expect(firstCallFillInSpy.called).to.be.ok;
		expect(secondCallFillInSpy.called).to.not.be.ok;

		onRenderEndedCallback(firstCallSlot);
		expect(secondCallFillInSpy.called).to.be.ok;
	});

	it('should not fill in second call slot if it is disabled', () => {
		const firstCallFillInSpy = spy();
		const secondCallFillInSpy = spy();

		// Enabled/Disabled should come from a single source.
		slotConfigs[secondCallSlot.getSlotName()].disabled = true;
		secondCallSlot.isEnabled = () => false;

		btfBlockerService.resetState();
		btfBlockerService.init();

		btfBlockerService.push(firstCallSlot, firstCallFillInSpy);
		btfBlockerService.push(secondCallSlot, secondCallFillInSpy);

		expect(firstCallFillInSpy.called).to.be.ok;
		expect(secondCallFillInSpy.called).to.not.be.ok;

		onRenderEndedCallback(firstCallSlot);
		expect(secondCallFillInSpy.called).to.not.be.ok;
	});

	it('should fill in second call slot when first call is finished manually', () => {
		const fillInSpy = spy();

		btfBlockerService.push(secondCallSlot, fillInSpy);
		btfBlockerService.finishFirstCall();

		expect(fillInSpy.called).to.be.ok;
	});

	it('should fill in second call slots if there are no first call slots', () => {
		const firstCallFillInSpy = spy();
		const secondCallFillInSpy = spy();

		// Enabled/Disabled should come from a single source.
		slotConfigs[firstCallSlot.getSlotName()].disabled = true;
		firstCallSlot.isEnabled = () => false;

		btfBlockerService.resetState();
		btfBlockerService.init();

		btfBlockerService.push(firstCallSlot, firstCallFillInSpy);
		btfBlockerService.push(secondCallSlot, secondCallFillInSpy);

		expect(firstCallFillInSpy.called).to.not.be.ok;
		expect(secondCallFillInSpy.called).to.be.ok;
	});
});
