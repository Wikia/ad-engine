import { expect } from 'chai';
import * as sinon from 'sinon';
import { AdSlot } from '../../../src/ad-engine/models';
import { context } from '../../../src/ad-engine/services';
import { slotPropertiesTrackingMiddleware } from '../../../src/ad-engine/tracking';

describe('slot-properties-tracking-middleware', () => {
	const sandbox = sinon.createSandbox();
	const clock = sinon.useFakeTimers();
	let adSlot: AdSlot;

	beforeEach(() => {
		sandbox.stub(window, 'performance').value({
			timing: {
				connectStart: 250,
			},
		});

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
	});

	afterEach(() => {
		sandbox.restore();
		clock.restore();
	});

	it('returns all info about slot for tracking', () => {
		// Move clock so we can assert ad load time
		clock.tick(600);

		const context = {
			data: {
				previous: 'value',
			},
			slot: adSlot,
		};
		const nextSpy = sinon.spy();

		slotPropertiesTrackingMiddleware(context, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).to.deep.equal({
			ad_load_time: 350,
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
			slot_size: '728x90',
		});
	});

	it('keeps ad_status if it was set before', () => {
		const context = {
			data: {
				ad_status: 'custom',
			},
			slot: adSlot,
		};
		const nextSpy = sinon.spy();

		slotPropertiesTrackingMiddleware(context, nextSpy);

		expect(nextSpy.getCall(0).args[0].data.ad_status).to.equal('custom');
	});
});
