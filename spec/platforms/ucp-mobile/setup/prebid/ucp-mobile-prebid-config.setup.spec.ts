import { context } from '@wikia/core';
import { UcpMobilePrebidConfigSetup } from '@wikia/platforms/ucp-mobile/setup/context/prebid/ucp-mobile-prebid-config.setup';

import { expect } from 'chai';

function getVideoBiddersWithBothSlots(biddersConfig) {
	return Object.keys(biddersConfig).filter(
		(configKey) =>
			biddersConfig[configKey]?.slots?.featured ||
			biddersConfig[configKey]?.slots?.incontent_player,
	);
}

describe('ucp-mobile prebid setup', () => {
	after(() => {
		context.remove('custom.hasFeaturedVideo');
		context.remove('bidders.prebid');
	});

	it('filters out featured slot when JWP is not on the page', () => {
		context.set('custom.hasFeaturedVideo', false);
		const setup = new UcpMobilePrebidConfigSetup();

		setup.execute();

		const biddersConfig = context.get('bidders.prebid');
		const videoBiddersWithBothSlotsConfigured = getVideoBiddersWithBothSlots(biddersConfig);
		videoBiddersWithBothSlotsConfigured.map((bidderName) => {
			expect(biddersConfig[bidderName].slots.featured).to.not.exist;
		});
	});

	it('filters out incontent_player slot when JWP is on the page', () => {
		context.set('custom.hasFeaturedVideo', true);
		const setup = new UcpMobilePrebidConfigSetup();

		setup.execute();

		const biddersConfig = context.get('bidders.prebid');
		const videoBiddersWithBothSlotsConfigured = getVideoBiddersWithBothSlots(biddersConfig);
		videoBiddersWithBothSlotsConfigured.map((bidderName) => {
			expect(biddersConfig[bidderName].slots.incontent_player).to.not.exist;
		});
	});
});
