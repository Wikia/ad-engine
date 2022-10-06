import { context, DiProcess, InstantConfigService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BiddersStateSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	execute(): void {
		this.setupBidders();
	}

	setupBidders(): void {
		const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');

		if (this.instantConfig.get('icA9Bidder')) {
			context.set('bidders.a9.enabled', true);
			context.set(
				'bidders.a9.videoEnabled',
				this.instantConfig.get('icA9VideoBidder') && hasFeaturedVideo,
			);
		}

		if (this.instantConfig.get('icPrebid')) {
			context.set('bidders.prebid.enabled', true);
			context.set('bidders.prebid.appnexus.enabled', this.instantConfig.get('icPrebidAppNexus'));
			context.set(
				'bidders.prebid.appnexusAst.enabled',
				this.instantConfig.get('icPrebidAppNexusAst'),
			);
			context.set(
				'bidders.prebid.appnexusNative.enabled',
				this.instantConfig.get('icPrebidAppNexusNative'),
			);
			context.set('bidders.prebid.gumgum.enabled', this.instantConfig.get('icPrebidGumGum'));
			context.set(
				'bidders.prebid.indexExchange.enabled',
				this.instantConfig.get('icPrebidIndexExchange'),
			);
			context.set('bidders.prebid.kargo.enabled', this.instantConfig.get('icPrebidKargo'));
			context.set('bidders.prebid.medianet.enabled', this.instantConfig.get('icPrebidMedianet'));
			context.set('bidders.prebid.nobid.enabled', this.instantConfig.get('icPrebidNobid'));
			context.set('bidders.prebid.oneVideo.enabled', this.instantConfig.get('icPrebidOneVideo'));
			context.set('bidders.prebid.openx.enabled', this.instantConfig.get('icPrebidOpenX'));
			context.set('bidders.prebid.pubmatic.enabled', this.instantConfig.get('icPrebidPubmatic'));
			context.set(
				'bidders.prebid.rubicon_display.enabled',
				this.instantConfig.get('icPrebidRubiconDisplay'),
			);
			context.set('bidders.prebid.roundel.enabled', this.instantConfig.get('icPrebidRoundel'));
			context.set('bidders.prebid.rubicon_pg.enabled', this.instantConfig.get('icPrebidRubiconPG'));
			context.set('bidders.prebid.rubicon.enabled', this.instantConfig.get('icPrebidRubicon'));
			context.set('bidders.prebid.telaria.enabled', this.instantConfig.get('icPrebidTelaria'));
			context.set(
				'bidders.prebid.triplelift.enabled',
				this.instantConfig.get('icPrebidTriplelift'),
			);
			context.set('bidders.prebid.verizon.enabled', this.instantConfig.get('icPrebidVerizon'));

			const testBidderConfig: object = this.instantConfig.get('icPrebidTestBidder');
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
}
