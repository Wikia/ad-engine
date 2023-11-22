import { getSlotNameByBidderAlias } from '@wikia/ad-bidders/bidder-helper';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('alias-helper', () => {
	describe('getSlotNameByBidderAlias', () => {
		it('should return slot name if has no alias', () => {
			global.sandbox.stub(context, 'get').withArgs('slots.slot1').returns({ uid: '12345' });

			const result = getSlotNameByBidderAlias('slot1');

			expect(result).to.deep.equal('slot1');
		});

		it('should return slot name if alias matches', () => {
			global.sandbox
				.stub(context, 'get')
				.withArgs('slots')
				.returns({
					slot2: { bidderAlias: 'slotAlias2' },
				});

			const result = getSlotNameByBidderAlias('slotAlias2');

			expect(result).to.deep.equal('slot2');
		});
	});
});
