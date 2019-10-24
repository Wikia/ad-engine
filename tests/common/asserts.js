import { expect } from 'chai';
import { adSlots } from './ad-slots';

class Asserts {
	assertSlotLineItemId(slot, expectedLineItemId) {
		slot.waitForLineItemIdAttribute();
		expect(slot.lineItemId).to.equal(expectedLineItemId, 'Line item ID mismatch');
	}

	assertInhouseCampaign(slot) {
		this.assertSlotLineItemId(slot, adSlots.inhouseLineItemId);
	}

	assertWikiaAdapterCampaign(slot) {
		this.assertSlotLineItemId(slot, adSlots.wikiaAdapterLineItemId);
	}
	assertAmazonCampaign(slot) {
		this.assertSlotLineItemId(slot, adSlots.amazonLineItemId);
	}
}

export const asserts = new Asserts();
