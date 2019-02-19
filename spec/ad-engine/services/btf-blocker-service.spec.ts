import { expect } from 'chai';
import { spy, createSandbox } from 'sinon';
import adSlotFake from '../ad-slot-fake';
import { btfBlockerService } from '../../../src/ad-engine/services/btf-blocker-service';
import { context } from '../../../src/ad-engine/services/context-service';

let atfSlot;
let btfSlot;
let onRenderEndedCallback;
let sandbox;

describe('btf-blocker-service', () => {
	beforeEach(() => {
		sandbox = createSandbox();
		sandbox.stub(context, 'push').callsFake((key, callbacks) => {
			onRenderEndedCallback = callbacks.onRenderEnded;
		});
		window.ads = {
			runtime: {},
		};

		btfBlockerService.init();
		btfBlockerService.resetState();

		atfSlot = Object.assign({}, adSlotFake);
		atfSlot.isFirstCall = () => true;
		btfSlot = Object.assign({}, adSlotFake);
		btfSlot.isFirstCall = () => false;
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should fill in ATF slot', () => {
		const fillInSpy = spy();

		btfBlockerService.push(atfSlot, fillInSpy);

		expect(fillInSpy.called).to.be.ok;
	});

	it('should not fill in BTF slot without ATF', () => {
		const fillInSpy = spy();

		btfBlockerService.push(btfSlot, fillInSpy);

		expect(fillInSpy.called).to.not.be.ok;
	});

	it('should not fill in BTF slot until ATF rendered', () => {
		const atfFillInSpy = spy();
		const btfFillInSpy = spy();

		btfBlockerService.push(atfSlot, atfFillInSpy);
		btfBlockerService.push(btfSlot, btfFillInSpy);

		expect(atfFillInSpy.called).to.be.ok;
		expect(btfFillInSpy.called).to.not.be.ok;
	});

	it('should fill in BTF slot after ATF rendered', () => {
		const atfFillInSpy = spy();
		const btfFillInSpy = spy();

		btfBlockerService.push(atfSlot, atfFillInSpy);
		btfBlockerService.push(btfSlot, btfFillInSpy);

		expect(atfFillInSpy.called).to.be.ok;
		expect(btfFillInSpy.called).to.not.be.ok;

		onRenderEndedCallback(atfSlot);
		expect(btfFillInSpy.called).to.be.ok;
	});

	it('should not fill in BTF if it is disabled', () => {
		const atfFillInSpy = spy();
		const btfFillInSpy = spy();

		btfSlot.isEnabled = () => false;

		btfBlockerService.push(atfSlot, atfFillInSpy);
		btfBlockerService.push(btfSlot, btfFillInSpy);

		expect(atfFillInSpy.called).to.be.ok;
		expect(btfFillInSpy.called).to.not.be.ok;

		onRenderEndedCallback(atfSlot);
		expect(btfFillInSpy.called).to.not.be.ok;
	});

	it('should fill in BTF slot when ATF is finished manually', () => {
		const fillInSpy = spy();

		btfBlockerService.push(btfSlot, fillInSpy);
		btfBlockerService.finishFirstCall();

		expect(fillInSpy.called).to.be.ok;
	});
});
