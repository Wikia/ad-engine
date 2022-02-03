import { Context } from '@ad-engine/core';
import { InstantConfigService } from '@ad-engine/services';

export function setupBidders(context: Context, instantConfig: InstantConfigService): void {
	const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');

	if (instantConfig.get('icA9Bidder')) {
		context.set('bidders.a9.enabled', true);
		context.set(
			'bidders.a9.videoEnabled',
			instantConfig.get('icA9VideoBidder') && hasFeaturedVideo,
		);
	}

	if (instantConfig.get('icPrebid')) {
		context.set('bidders.prebid.enabled', true);
		context.set('bidders.prebid.libraryUrl', instantConfig.get('icPrebidVersion'));
		context.set('bidders.prebid.33across.enabled', instantConfig.get('icPrebid33Across'));
		context.set('bidders.prebid.appnexus.enabled', instantConfig.get('icPrebidAppNexus'));
		context.set('bidders.prebid.appnexusAst.enabled', instantConfig.get('icPrebidAppNexusAst'));
		context.set(
			'bidders.prebid.appnexusGroupM.enabled',
			instantConfig.get('icPrebidAppNexusGroupM'),
		);
		context.set('bidders.prebid.beachfront.enabled', instantConfig.get('icPrebidBeachfront'));
		context.set('bidders.prebid.gumgum.enabled', instantConfig.get('icPrebidGumGum'));
		context.set('bidders.prebid.indexExchange.enabled', instantConfig.get('icPrebidIndexExchange'));
		context.set('bidders.prebid.kargo.enabled', instantConfig.get('icPrebidKargo'));
		context.set('bidders.prebid.mediagrid.enabled', instantConfig.get('icPrebidMediaGrid'));
		context.set('bidders.prebid.medianet.enabled', instantConfig.get('icPrebidMedianet'));
		context.set('bidders.prebid.nobid.enabled', instantConfig.get('icPrebidNobid'));
		context.set('bidders.prebid.oneVideo.enabled', instantConfig.get('icPrebidOneVideo'));
		context.set('bidders.prebid.openx.enabled', instantConfig.get('icPrebidOpenX'));
		context.set('bidders.prebid.pubmatic.enabled', instantConfig.get('icPrebidPubmatic'));
		context.set(
			'bidders.prebid.rubicon_display.enabled',
			instantConfig.get('icPrebidRubiconDisplay'),
		);
		context.set('bidders.prebid.rubicon.enabled', instantConfig.get('icPrebidRubicon'));
		context.set('bidders.prebid.telaria.enabled', instantConfig.get('icPrebidTelaria'));
		context.set('bidders.prebid.triplelift.enabled', instantConfig.get('icPrebidTriplelift'));
		context.set('bidders.prebid.verizon.enabled', instantConfig.get('icPrebidVerizon'));

		context.set(
			'custom.jwplayerDataProvider',
			instantConfig.get('icPrebidMediaGrid') && hasFeaturedVideo,
		);

		const testBidderConfig: object = instantConfig.get('icPrebidTestBidder');
		if (testBidderConfig) {
			context.set('bidders.prebid.testBidder', {
				enabled: true,
				name: testBidderConfig['name'],
				slots: testBidderConfig['slots'],
			});
		}
	}

	context.set(
		'bidders.enabled',
		context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'),
	);
}
