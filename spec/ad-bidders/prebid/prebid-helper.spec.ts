import { getDealsTargetingFromBid, isSlotApplicable } from '@wikia/ad-bidders/prebid/prebid-helper';
import { context, slotService } from '@wikia/core';
import { expect } from 'chai';
import sinon from 'sinon';

describe('getDealsTargetingFromBid', () => {
	it('returns all hb_deal_* key-values', () => {
		const targeting = getDealsTargetingFromBid({
			adserverTargeting: {
				hb_deal_foo: 123,
				hb_bidder: 'foo',
				hb_deal_bar: 'abc',
				hb_pb: 12.02,
			},
		});

		expect(Object.keys(targeting).length).to.equal(2);
		expect(Object.keys(targeting)).to.deep.equal(['hb_deal_foo', 'hb_deal_bar']);
	});

	describe('isSlotApplicable', () => {
		let serviceSlotGetStateStub;
		let contextSlots;

		beforeEach(() => {
			serviceSlotGetStateStub = sinon.stub(slotService, 'getState' as any);
			serviceSlotGetStateStub.returns(true);
			context.remove('bidders.prebid.filter');
			contextSlots = context.get('slots');
			context.remove('slots');
		});

		afterEach(() => {
			serviceSlotGetStateStub.restore();
			context.remove('slots');
			context.set('slots', contextSlots);
		});

		it('- standard (no filter & adDisplay slots)', () => {
			context.set('slots', {
				'slot-123': {},
			});

			const result = isSlotApplicable('slot-123');
			expect(result).to.be.true;
		});

		it('- standard (filter=static & adDisplay slots)', () => {
			context.set('slots', {
				'slot-123': {},
			});
			context.set('bidders.prebid.filter', 'static');
			const querySelectorStub = global.sandbox.stub(document, 'querySelector');
			const dummyElement = document.createElement('div');
			querySelectorStub.returns(dummyElement);

			const result = isSlotApplicable('slot-123');
			expect(result).to.be.true;
		});
	});
});
