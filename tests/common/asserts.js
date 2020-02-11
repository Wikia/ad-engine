import { expect } from 'chai';

class Asserts {
	constructor() {
		this.inhouseLineItemId = '271491732';
		this.wikiaAdapterLineItemId = '321546972';
		this.amazonLineItemId = '4397742201';
	}

	assertSlotLineItemId(slot, expectedLineItemId) {
		slot.waitForLineItemIdAttribute();
		expect(slot.lineItemId).to.equal(expectedLineItemId, 'Line item ID mismatch');
	}

	assertInhouseCampaign(slot) {
		this.assertSlotLineItemId(slot, this.inhouseLineItemId);
	}

	assertWikiaAdapterCampaign(slot) {
		this.assertSlotLineItemId(slot, this.wikiaAdapterLineItemId);
	}
	assertAmazonCampaign(slot) {
		this.assertSlotLineItemId(slot, this.amazonLineItemId);
	}
}

export const asserts = new Asserts();
