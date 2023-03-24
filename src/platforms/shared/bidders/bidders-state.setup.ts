import {
	context,
	Dictionary,
	DiProcess,
	InstantConfigService,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BiddersStateSetup implements DiProcess {
	private selectedBidder: string;
	private prebidBidders: Dictionary<string> = {
		appnexus: 'icPrebidAppNexus',
		appnexusAst: 'icPrebidAppNexusAst',
		appnexusNative: 'icPrebidAppNexusNative',
		criteo: 'icPrebidCriteo',
		freewheel: 'icPrebidFreewheel',
		gumgum: 'icPrebidGumGum',
		indexExchange: 'icPrebidIndexExchange',
		kargo: 'icPrebidKargo',
		medianet: 'icPrebidMedianet',
		nobid: 'icPrebidNobid',
		ogury: 'icPrebidOgury',
		oneVideo: 'icPrebidOneVideo',
		pubmatic: 'icPrebidPubmatic',
		rubicon_display: 'icPrebidRubiconDisplay',
		roundel: 'icPrebidRoundel',
		rubicon_pg: 'icPrebidRubiconPG',
		rubicon: 'icPrebidRubicon',
		triplelift: 'icPrebidTriplelift',
		verizon: 'icPrebidVerizon',
		yahoossp: 'icPrebidYahooSsp',
	};

	constructor(private instantConfig: InstantConfigService) {
		this.selectedBidder = utils.queryString.get('select_bidder') || '';
	}

	execute(): void {
		this.setupBidders();
	}

	setupBidders(): void {
		if (this.instantConfig.get('icA9Bidder')) {
			context.set('bidders.a9.enabled', true);
			context.set('bidders.coppaA9', this.instantConfig.get('icCoppaA9'));
			context.set(
				'bidders.a9.videoEnabled',
				this.instantConfig.get('icA9VideoBidder') && isAnyVideo(),
			);
		}

		if (this.instantConfig.get('icPrebid')) {
			context.set('bidders.prebid.enabled', true);

			for (const [bidderName, icVariable] of Object.entries(this.prebidBidders)) {
				this.enableIfApplicable(bidderName, icVariable);
			}

			const testBidderConfig: object = this.instantConfig.get('icPrebidTestBidder');
			if (testBidderConfig) {
				context.set('bidders.prebid.testBidder', {
					name: testBidderConfig['name'],
					slots: testBidderConfig['slots'],
				});
				this.enableIfApplicable('testBidder', 'icPrebidTestBidder');
			}
		}

		context.set(
			'bidders.enabled',
			context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'),
		);

		function isAnyVideo(): boolean {
			// Is there is a FeaturedVideo on UCP?
			const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');

			// Is there a video on News&Ratings?
			const ptypeIncludesVideo = targetingService.get('ptype')?.includes('video_');

			return Boolean(hasFeaturedVideo || ptypeIncludesVideo);
		}
	}

	private enableIfApplicable(name: string, icKey: string): void {
		if (this.selectedBidder && name !== this.selectedBidder) {
			context.set(`bidders.prebid.${name}.enabled`, false);
			return;
		}

		context.set(`bidders.prebid.${name}.enabled`, !!this.instantConfig.get(icKey));
	}
}
