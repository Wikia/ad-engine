import { createAdapterSpecificSettings } from '@wikia/ad-bidders/prebid/prebid-settings';
import { expect } from 'chai';

describe('prebid settings', () => {
	describe('createAdapterSpecificSettings', () => {
		it('returns settings rules based on adapters list', () => {
			const adapterSettings = createAdapterSpecificSettings([
				{
					bidderName: 'foo',
				},
				{
					malformedAdapter: true,
				},
				{
					bidderName: 'bar',
					bidderSettings: {
						storageAllowed: true,
					},
				},
			]);

			expect(Object.keys(adapterSettings).length).to.equal(2);

			expect(adapterSettings.foo.adserverTargeting[0].key).to.equal('hb_deal_foo');
			expect(adapterSettings.foo.suppressEmptyKeys).to.equal(true);
			expect(adapterSettings.foo.storageAllowed).to.equal(undefined);

			expect(adapterSettings.bar.adserverTargeting[0].key).to.equal('hb_deal_bar');
			expect(adapterSettings.bar.suppressEmptyKeys).to.equal(true);
			expect(adapterSettings.bar.storageAllowed).to.equal(true);
		});

		it('returns settings rules for aliases', () => {
			const adapterSettings = createAdapterSpecificSettings([
				{
					bidderName: 'bar',
					bidderSettings: {
						storageAllowed: true,
					},
					aliases: {
						foo: ['bar'],
					},
				},
			]);

			expect(Object.keys(adapterSettings).length).to.equal(2);

			expect(adapterSettings.bar.adserverTargeting[0].key).to.equal('hb_deal_bar');
			expect(adapterSettings.bar.suppressEmptyKeys).to.equal(true);
			expect(adapterSettings.bar.storageAllowed).to.equal(true);

			expect(adapterSettings.foo.adserverTargeting[0].key).to.equal('hb_deal_bar');
			expect(adapterSettings.foo.suppressEmptyKeys).to.equal(true);
			expect(adapterSettings.foo.storageAllowed).to.equal(true);
		});
	});
});
