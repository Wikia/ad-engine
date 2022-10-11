import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BiddersStateSetup implements DiProcess {
	private selectedBidder: string;

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

			this.enableBidder('appnexus', 'icPrebidAppNexus');
			this.enableBidder('appnexusAst', 'icPrebidAppNexusAst');
			this.enableBidder('appnexusNative', 'icPrebidAppNexusNative');
			this.enableBidder('gumgum', 'icPrebidGumGum');
			this.enableBidder('indexExchange', 'icPrebidIndexExchange');
			this.enableBidder('kargo', 'icPrebidKargo');
			this.enableBidder('medianet', 'icPrebidMedianet');
			this.enableBidder('nobid', 'icPrebidNobid');
			this.enableBidder('oneVideo', 'icPrebidOneVideo');
			this.enableBidder('openx', 'icPrebidOpenX');
			this.enableBidder('pubmatic', 'icPrebidPubmatic');
			this.enableBidder('rubicon_display', 'icPrebidRubiconDisplay');
			this.enableBidder('roundel', 'icPrebidRoundel');
			this.enableBidder('rubicon_pg', 'icPrebidRubiconPG');
			this.enableBidder('rubicon', 'icPrebidRubicon');
			this.enableBidder('telaria', 'icPrebidTelaria');
			this.enableBidder('triplelift', 'icPrebidTriplelift');
			this.enableBidder('verizon', 'icPrebidVerizon');

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

	private enableBidder(name: string, icKey: string): void {
		if (this.selectedBidder && name !== this.selectedBidder) {
			context.set(`bidders.prebid.${name}.enabled`, false);
		}

		context.set(`bidders.prebid.${name}.enabled`, this.instantConfig.get(icKey));
	}
}
