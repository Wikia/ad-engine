import { AdSlot, context, slotPropertiesTrackingMiddleware } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('slot-properties-tracking-middleware', () => {
	const sandbox = createSandbox();
	let adSlot: AdSlot;

	beforeEach(() => {
		context.set('slots.foo.targeting', {
			rv: 5,
			wsi: 'ola1',
		});
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
	});

	it('returns all info about slot for tracking', () => {
		const testContext = {
			data: {
				previous: 'value',
			},
			slot: adSlot,
		};
		const nextSpy = sandbox.spy();

		slotPropertiesTrackingMiddleware(testContext, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).to.deep.equal({
			ad_status: 'success',
			advertiser_id: '567',
			creative_id: 123,
			creative_size: '728x90',
			kv_pos: 'foo',
			kv_rv: 5,
			kv_wsi: 'ola1',
			order_id: 3,
			previous: 'value',
			product_lineitem_id: 789,
			slot_id: 'a2b01b9f-69df-4481-9daf-9e27bf26502b',
			slot_size: '728x90',
		});
	});

	it('keeps ad_status if it was set before', () => {
		const testContext = {
			data: {
				ad_status: 'custom',
			},
			slot: adSlot,
		};
		const nextSpy = sandbox.spy();

		slotPropertiesTrackingMiddleware(testContext, nextSpy);

		expect(nextSpy.getCall(0).args[0].data.ad_status).to.equal('custom');
	});
});
