import { context } from '@wikia/core';
import { UcpDesktopPrebidConfigSetup } from '@wikia/platforms/ucp-desktop/setup/context/prebid/ucp-desktop-prebid-config.setup';
import { getVideoBiddersWithVideoSlots } from '../../../../helpers/get-video-bidders-with-video-slots';

import { expect } from 'chai';

describe('ucp-desktop prebid setup', () => {
	after(() => {
		context.remove('custom.hasFeaturedVideo');
		context.remove('bidders.prebid');
	});

	it('filters out featured slot when JWP is not on the page', () => {
		context.set('custom.hasFeaturedVideo', false);
		const setup = new UcpDesktopPrebidConfigSetup();

		setup.execute();

		const biddersConfig = context.get('bidders.prebid');
		const videoBiddersWithBothSlotsConfigured = getVideoBiddersWithVideoSlots(biddersConfig);
		videoBiddersWithBothSlotsConfigured.map((bidderName) => {
			expect(biddersConfig[bidderName].slots.featured).to.not.exist;
		});
	});

	it('filters out incontent_player slot when JWP is on the page', () => {
		context.set('custom.hasFeaturedVideo', true);
		const setup = new UcpDesktopPrebidConfigSetup();

		setup.execute();

		const biddersConfig = context.get('bidders.prebid');
		const videoBiddersWithBothSlotsConfigured = getVideoBiddersWithVideoSlots(biddersConfig);
		videoBiddersWithBothSlotsConfigured.map((bidderName) => {
			expect(biddersConfig[bidderName].slots.incontent_player).to.not.exist;
		});
	});
});
