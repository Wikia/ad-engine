import { AdSlot, context } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { slotTrackingMiddleware } from '../../../src/ad-tracking';

describe('slot-properties-tracking-middleware', () => {
	const sandbox = createSandbox();
	let adSlot: AdSlot;

	beforeEach(() => {
		adSlot = new AdSlot({ id: 'foo' });
		adSlot.advertiserId = '567';
		adSlot.creativeId = 123;
		adSlot.creativeSize = [728, 90];
		adSlot.lineItemId = 789;
		adSlot.orderId = 3;
		adSlot.status = 'success';

		sandbox.stub(adSlot, 'getUid').returns('a2b01b9f-69df-4481-9daf-9e27bf26502b');
	});

	afterEach(() => {
		sandbox.restore();

		context.remove('targeting.cortex-visitor');
		context.remove('options.geoRequiresSignal');
	});

	it('returns info about cortex-visitor (yes) if set in targeting', () => {
		const nextSpy = sandbox.spy();
		context.set('targeting.cortex-visitor', 'yes');

		slotTrackingMiddleware({ data: {}, slot: adSlot }, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).to.deep.include({
			key_vals: 'cortex-visitor=yes',
		});
	});

	it('returns info about cortex-visitor (no) if set in targeting', () => {
		const nextSpy = sandbox.spy();
		context.set('targeting.cortex-visitor', 'no');

		slotTrackingMiddleware({ data: {}, slot: adSlot }, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).to.deep.include({
			key_vals: 'cortex-visitor=no',
		});
	});

	it('does not return info about cortex-visitor if not set in targeting', () => {
		const nextSpy = sandbox.spy();
		context.remove('targeting.cortex-visitor');

		slotTrackingMiddleware({ data: {}, slot: adSlot }, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).not.to.deep.include({
			key_vals: 'cortex-visitor=no',
		});
	});
});
