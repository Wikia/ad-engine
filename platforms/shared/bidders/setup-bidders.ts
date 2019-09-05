import { Context, InstantConfigService } from '@wikia/ad-engine';

export function setupBidders(context: Context, instantConfig: InstantConfigService): void {
	const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');

	if (hasFeaturedVideo) {
		context.set('templates.stickyTLB.enabled', false);
	}

	context.set('bidders.a9.enabled', instantConfig.get('icA9Bidder'));
	context.set('bidders.a9.dealsEnabled', instantConfig.get('icA9Deals'));
	context.set('bidders.a9.videoEnabled', instantConfig.get('icA9VideoBidder') && hasFeaturedVideo);

	if (instantConfig.get('icPrebid')) {
		context.set('bidders.prebid.enabled', true);
		context.set('bidders.prebid.aol.enabled', instantConfig.get('icPrebidAol'));
		context.set('bidders.prebid.appnexus.enabled', instantConfig.get('icPrebidAppNexus'));
		context.set('bidders.prebid.beachfront.enabled', instantConfig.get('icPrebidBeachfront'));
		context.set('bidders.prebid.gumgum.enabled', instantConfig.get('icPrebidGumGum'));
		context.set('bidders.prebid.indexExchange.enabled', instantConfig.get('icPrebidIndexExchange'));
		context.set('bidders.prebid.kargo.enabled', instantConfig.get('icPrebidKargo'));
		context.set('bidders.prebid.lkqd.enabled', instantConfig.get('icPrebidLkqd'));
		context.set('bidders.prebid.onemobile.enabled', instantConfig.get('icPrebidOneMobile'));
		context.set('bidders.prebid.openx.enabled', instantConfig.get('icPrebidOpenX'));
		context.set('bidders.prebid.pubmatic.enabled', instantConfig.get('icPrebidPubmatic'));
		context.set('bidders.prebid.vmg.enabled', instantConfig.get('icPrebidVmg'));
		context.set('bidders.prebid.appnexusAst.enabled', instantConfig.get('icPrebidAppNexusAst'));
		context.set('bidders.prebid.rubicon.enabled', instantConfig.get('icPrebidRubicon'));
		context.set(
			'bidders.prebid.rubicon_display.enabled',
			instantConfig.get('icPrebidRubiconVideo'),
		);

		context.set('bidders.prebid.bidsRefreshing.enabled', context.get('options.slotRepeater'));
		context.set('custom.rubiconInFV', instantConfig.get('icPrebidRubicon') && hasFeaturedVideo);

		if (!instantConfig.get('icPrebidLkqdOutstream')) {
			context.remove('bidders.prebid.lkqd.slots.INCONTENT_PLAYER');
		}

		if (!instantConfig.get('icPrebidPubmaticOutstream')) {
			context.remove('bidders.prebid.pubmatic.slots.INCONTENT_PLAYER');
		}
	}

	context.set(
		'bidders.enabled',
		context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'),
	);
}
