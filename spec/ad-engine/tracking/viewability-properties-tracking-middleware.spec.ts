import { expect } from 'chai';
import { AdSlot } from '../../../src/ad-engine/models';
import { viewabilityPropertiesTrackingMiddleware } from '../../../src/ad-engine/tracking';

describe('viewability-properties-tracking-middleware', () => {
	let adSlot;

	beforeEach(() => {
		adSlot = new AdSlot({ id: 'foo' });
		adSlot.creativeId = 123;
		adSlot.lineItemId = 789;
	});

	it('returns all info about slot for tracking', () => {
		const data = viewabilityPropertiesTrackingMiddleware((data) => data)(
			{ previous: 'value' },
			adSlot,
		);

		expect(data).to.deep.equal({
			creative_id: 123,
			line_item_id: 789,
			previous: 'value',
		});
	});
});
