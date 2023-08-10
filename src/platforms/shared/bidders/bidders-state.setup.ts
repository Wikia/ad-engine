import { context, Dictionary, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
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
		openx: 'icPrebidOpenX',
		pubmatic: 'icPrebidPubmatic',
		rubicon_display: 'icPrebidRubiconDisplay',
		roundel: 'icPrebidRoundel',
		rubicon: 'icPrebidRubicon',
		triplelift: 'icPrebidTriplelift',
		verizon: 'icPrebidVerizon',
		yahoossp: 'icPrebidYahooSsp',
	};
	private notCoppaCompliantBidders: Array<keyof typeof this.prebidBidders> = ['kargo', 'verizon'];

	constructor(private instantConfig: InstantConfigService) {
		this.selectedBidder = utils.queryString.get('select_bidder') || '';
	}

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

			context.set('bidders.prebid.intentIQ', this.instantConfig.get('icPrebidIntentIQ', false));
			context.set('bidders.prebid.id5', this.instantConfig.get('icPrebidId5', false));
			context.set('bidders.prebid.id5AbValue', this.instantConfig.get('icPrebidId5AB', 0));
		}

		context.set(
			'bidders.enabled',
			context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'),
		);
	}

	private enableIfApplicable(name: string, icKey: string): void {
		if (this.selectedBidder && name !== this.selectedBidder) {
			context.set(`bidders.prebid.${name}.enabled`, false);
			return;
		}

		if (utils.isCoppaSubject() && !this.isBidderCoppaCompliant(name)) {
			context.set(`bidders.prebid.${name}.enabled`, false);
			return;
		}

		context.set(`bidders.prebid.${name}.enabled`, !!this.instantConfig.get(icKey));
	}

	private isBidderCoppaCompliant(bidderName: string): boolean {
		return !this.notCoppaCompliantBidders.includes(bidderName);
	}
}
