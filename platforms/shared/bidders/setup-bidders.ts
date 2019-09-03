import { Context, InstantConfigService } from '@wikia/ad-engine';

export function setupBidders(instantConfig: InstantConfigService, context: Context): void {
	context.set(
		'custom.beachfrontDfp',
		instantConfig.isGeoEnabled('wgAdDriverBeachfrontDfpCountries'),
	); // delete
	context.set('custom.lkqdDfp', instantConfig.isGeoEnabled('wgAdDriverLkqdBidderCountries')); // delete
	context.set('custom.pubmaticDfp', instantConfig.isGeoEnabled('wgAdDriverPubMaticDfpCountries')); // delete

	const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');

	context.set('bidders.a9.enabled', instantConfig.get('icA9Bidder'));
	context.set('bidders.a9.dealsEnabled', instantConfig.get('icA9Deals'));
	context.set('bidders.a9.videoEnabled', instantConfig.get('icA9VideoBidder') && hasFeaturedVideo);

	if (hasFeaturedVideo) {
		context.set('templates.stickyTLB.enabled', false);
	}

	if (instantConfig.get('icPrebid')) {
		context.set('bidders.prebid.enabled', true);
		context.set('bidders.prebid.aol.enabled', instantConfig.get('icPrebidAol'));
		context.set('bidders.prebid.appnexus.enabled', instantConfig.get('icPrebidAppNexus'));
		context.set('bidders.prebid.beachfront.enabled', instantConfig.get('icPrebidBeachfront'));
		context.set('bidders.prebid.gumgum.enabled', instantConfig.get('icGumGum'));
		context.set('bidders.prebid.indexExchange.enabled', instantConfig.get('icPrebidIndexExchange'));
		context.set('bidders.prebid.kargo.enabled', instantConfig.get('icPrebidKargo'));
		context.set('bidders.prebid.lkqd.enabled', instantConfig.get('icPrebidLkqd'));
		context.set('bidders.prebid.onemobile.enabled', instantConfig.get('icPrebidOneMobile'));
		context.set('bidders.prebid.openx.enabled', instantConfig.get('icPrebidOpenX'));
		context.set('bidders.prebid.pubmatic.enabled', instantConfig.get('icPrebidPubmatic'));
		context.set('bidders.prebid.vmg.enabled', instantConfig.get('icPrebidVmg'));
		context.set('bidders.prebid.appnexusAst.enabled', instantConfig.get('icPrebidAppNexus'));
		context.set('bidders.prebid.rubicon.enabled', instantConfig.get('icPrebidRubicon'));
		context.set(
			'bidders.prebid.rubicon_display.enabled',
			instantConfig.get('icPrebidRubiconDisplay'),
		);

		const s1 = context.get('wiki.targeting.wikiIsTop1000')
			? context.get('targeting.s1')
			: 'not a top1k wiki';

		context.set('bidders.prebid.targeting', {
			src: ['gpt'],
			s0: [context.get('targeting.s0') || ''],
			s1: [s1],
			s2: [context.get('targeting.s2') || ''],
			lang: [context.get('targeting.wikiLanguage') || 'en'],
		});

		context.set('bidders.prebid.bidsRefreshing.enabled', context.get('options.slotRepeater'));
		context.set('custom.rubiconInFV', instantConfig.get('icPrebidRubicon') && hasFeaturedVideo);
		context.set('custom.isCMPEnabled', true);

		if (!instantConfig.get('icPrebidLkqdOutstream')) {
			context.remove('bidders.prebid.lkqd.slots.INCONTENT_PLAYER');
		}

		if (!instantConfig.get('icPrebidPubmaticOutstream')) {
			context.remove('bidders.prebid.pubmatic.slots.INCONTENT_PLAYER');
		}
	}
}
