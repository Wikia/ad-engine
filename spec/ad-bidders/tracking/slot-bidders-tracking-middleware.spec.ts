import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { bidders } from '../../../src/ad-bidders';
import { slotBiddersTrackingMiddleware } from '../../../src/ad-bidders/tracking';
import { AdSlot } from '../../../src/ad-engine/models';

describe('slot-bidders-tracking-middleware', () => {
	const sandbox = createSandbox();
	let adSlot: AdSlot;
	let getDfpSlotPricesStub: SinonStub;
	let getCurrentSlotPricesStub: SinonStub;

	beforeEach(() => {
		adSlot = new AdSlot({ id: 'foo' });
		adSlot.winningBidderDetails = {
			name: 'rubicon',
			price: '11.00',
		};

		getDfpSlotPricesStub = sandbox.stub(bidders, 'getDfpSlotPrices');
		getCurrentSlotPricesStub = sandbox.stub(bidders, 'getCurrentSlotPrices');

		getCurrentSlotPricesStub.returns({
			wikia: 20.0,
			indexExchange: 1.0,
			appnexus: 2.0,
			rubicon: 4.0,
			wikiaVideo: 8.0,
			openx: 9.0,
			appnexusAst: 10.0,
			rubicon_display: 11.0,
			a9: 12.0,
			pubmatic: 14.0,
			beachfront: 15.0,
			kargo: 17.0,
			gumgum: 19.0,
			'33across': 20.0,
			triplelift: 21.0,
			oneVideo: 23.0,
			nobid: 25.0,
			telaria: 26.0,
			mediagrid: 27.0,
			verizon: 28.0,
			appnexusGroupM: 29.0,
			medianet: 30.0,
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('returns bidders info for tracking', async () => {
		getDfpSlotPricesStub.returns({
			wikia: 20.0,
			indexExchange: 1.0,
			appnexus: 2.0,
			rubicon: 4.0,
			wikiaVideo: 8.0,
			openx: 9.0,
			appnexusAst: 10.0,
			rubicon_display: 11.0,
			a9: 12.0,
			pubmatic: 14.0,
			beachfront: 15.0,
			kargo: 17.0,
			gumgum: 19.0,
			'33across': 20.0,
			triplelift: 21.0,
			oneVideo: 23.0,
			nobid: 25.0,
			telaria: 26.0,
			mediagrid: 27.0,
			verizon: 28.0,
			appnexusGroupM: 29.0,
			medianet: 30.0,
		});

		const context = {
			data: {
				previous: 'value',
			},
			slot: adSlot,
		};
		const nextSpy = sandbox.spy();

		await slotBiddersTrackingMiddleware(context, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).to.deep.equal({
			previous: 'value',
			bidder_won: 'rubicon',
			bidder_won_price: '11.00',
			bidder_0: 20.0,
			bidder_1: 1.0,
			bidder_2: 2.0,
			bidder_4: 4.0,
			bidder_8: 8.0,
			bidder_9: 9.0,
			bidder_10: 10.0,
			bidder_11: 11.0,
			bidder_12: 12.0,
			bidder_14: 14.0,
			bidder_15: 15.0,
			bidder_17: 17.0,
			bidder_19: 19.0,
			bidder_20: 20.0,
			bidder_21: 21.0,
			bidder_23: 23.0,
			bidder_25: 25.0,
			bidder_26: 26.0,
			bidder_27: 27.0,
			bidder_28: 28.0,
			bidder_29: 29.0,
			bidder_30: 30.0,
		});
	});

	it('returns bidders current slot prices when there were no price at the time of ad request', async () => {
		const context = {
			data: {
				previous: 'value',
			},
			slot: adSlot,
		};
		const nextSpy = sandbox.spy();

		await slotBiddersTrackingMiddleware(context, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).to.deep.equal({
			previous: 'value',
			bidder_won: 'rubicon',
			bidder_won_price: '11.00',
			bidder_0: '20not_used',
			bidder_1: '1not_used',
			bidder_2: '2not_used',
			bidder_4: '4not_used',
			bidder_8: '8not_used',
			bidder_9: '9not_used',
			bidder_10: '10not_used',
			bidder_11: '11not_used',
			bidder_12: '12not_used',
			bidder_14: '14not_used',
			bidder_15: '15not_used',
			bidder_17: '17not_used',
			bidder_19: '19not_used',
			bidder_20: '20not_used',
			bidder_21: '21not_used',
			bidder_23: '23not_used',
			bidder_25: '25not_used',
			bidder_26: '26not_used',
			bidder_27: '27not_used',
			bidder_28: '28not_used',
			bidder_29: '29not_used',
			bidder_30: '30not_used',
		});
	});
});
