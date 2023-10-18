import { context } from '@wikia/core';
import { UcpMobilePrebidConfigSetup } from '@wikia/platforms/ucp-mobile/setup/context/prebid/ucp-mobile-prebid-config.setup';
import { getVideoBiddersWithVideoSlots } from '../../../../helpers/get-video-bidders-with-video-slots';

import { expect } from 'chai';

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
		const videoBiddersWithBothSlotsConfigured = getVideoBiddersWithVideoSlots(biddersConfig);
		videoBiddersWithBothSlotsConfigured.map((bidderName) => {
			expect(biddersConfig[bidderName].slots.featured).to.not.exist;
		});
	});

	it('filters out incontent_player slot when JWP is on the page', () => {
		context.set('custom.hasFeaturedVideo', true);
		const setup = new UcpMobilePrebidConfigSetup();

		setup.execute();

		const biddersConfig = context.get('bidders.prebid');
		const videoBiddersWithBothSlotsConfigured = getVideoBiddersWithVideoSlots(biddersConfig);
		videoBiddersWithBothSlotsConfigured.map((bidderName) => {
			expect(biddersConfig[bidderName].slots.incontent_player).to.not.exist;
		});
	});
});
