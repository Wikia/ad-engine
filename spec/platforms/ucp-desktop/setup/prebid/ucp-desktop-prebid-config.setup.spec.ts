import { context } from '@wikia/core';
import { UcpDesktopPrebidConfigSetup } from '@wikia/platforms/ucp-desktop/setup/context/prebid/ucp-desktop-prebid-config.setup';

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

		expect(context.get('bidders.prebid.appnexusAst.slots.incontent_player')).to.exist;
		expect(context.get('bidders.prebid.appnexusAst.slots.featured')).to.not.exist;
	});

	it('filters out incontent_player slot when JWP is on the page', () => {
		context.set('custom.hasFeaturedVideo', true);
		const setup = new UcpDesktopPrebidConfigSetup();

		setup.execute();

		expect(context.get('bidders.prebid.appnexusAst.slots.incontent_player')).to.not.exist;
		expect(context.get('bidders.prebid.appnexusAst.slots.featured')).to.exist;
	});

	it('filters out featured slot when JWP is not on the page for bidder with all kinds slots in config', () => {
		context.set('custom.hasFeaturedVideo', false);
		const setup = new UcpDesktopPrebidConfigSetup();

		setup.execute();

		expect(context.get('bidders.prebid.pubmatic.slots.top_leaderboard')).to.exist;
		expect(context.get('bidders.prebid.pubmatic.slots.incontent_player')).to.exist;
		expect(context.get('bidders.prebid.pubmatic.slots.featured')).to.not.exist;
	});
});
