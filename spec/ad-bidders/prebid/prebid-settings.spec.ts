import { createAdapterSpecificSettings } from '@wikia/ad-bidders/prebid/prebid-settings';
import { context } from '@wikia/ad-engine/services/context-service';
import { expect } from 'chai';

describe('prebid settings', () => {
	describe('createAdapterSpecificSettings', () => {
		it('returns undefined when built it logic is disabled', () => {
			context.set('bidders.prebid.useBuiltInTargetingLogic', false);

			expect(createAdapterSpecificSettings([])).to.equal(undefined);
		});

		it('returns settings rules based on adapters list', () => {
			context.set('bidders.prebid.useBuiltInTargetingLogic', true);

			const adapterSettings = createAdapterSpecificSettings([
				{
					bidderName: 'foo',
				},
				{
					malformedAdapter: true,
				},
				{
					bidderName: 'bar',
				},
			]);

			expect(Object.keys(adapterSettings).length).to.equal(2);

			expect(adapterSettings.foo.adserverTargeting[0].key).to.equal('hb_deal_foo');
			expect(adapterSettings.foo.suppressEmptyKeys).to.equal(true);

			expect(adapterSettings.bar.adserverTargeting[0].key).to.equal('hb_deal_bar');
			expect(adapterSettings.bar.suppressEmptyKeys).to.equal(true);
		});
	});
});
