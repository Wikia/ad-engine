import { expect } from 'chai';
import * as sinon from 'sinon';
import { AdSlot } from '../../../src/ad-engine/models';
import { slotBillTheLizardStatusTrackingMiddleware } from '../../../src/ad-services/bill-the-lizard';

describe('slot-bill-the-lizard-tracking-middleware', () => {
	let adSlot: AdSlot;

	beforeEach(() => {
		adSlot = new AdSlot({ id: 'foo' });
		adSlot.setConfigProperty('btlStatus', 'rabbitMagic');
	});

	it('returns all info about slot for tracking', () => {
		const context = {
			data: {
				previous: 'value',
			},
			slot: adSlot,
		};
		const nextSpy = sinon.spy();

		slotBillTheLizardStatusTrackingMiddleware(context, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).to.deep.equal({
			btl: 'rabbitMagic',
			previous: 'value',
		});
	});
});
