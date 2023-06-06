import {
	context,
	DEFAULT_MAX_DELAY,
	externalLogger,
	targetingService,
	utils,
} from '@ad-engine/core';
import { getAvailableBidsByAdUnitCode } from '../prebid-helper';

const logGroup = 'IntentIQ';

export class IntentIQ {
	private loadPromise: Promise<void>;
	private loaded = false;
	private fandomId = 1187275693;
	private intentIQScriptUrl =
		'//script.wikia.nocookie.net/fandom-ae-assets/intentiq/5.4/IIQUniversalID.js';
	private intentIqObject: IntentIqObject;

	preloadScript(): Promise<void> {
		if (this.loadPromise) {
			return this.loadPromise;
		}

		this.loadPromise = utils.scriptLoader
			.loadScript(this.intentIQScriptUrl, 'text/javascript', true, 'first')
			.then(() => {
				this.loaded = true;
				utils.logger(logGroup, 'loaded');
			});
	}

	async initialize(pbjs: Pbjs): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.loaded) {
			await this.preloadScript();
			await new utils.WaitFor(() => window.IntentIqObject !== undefined, 10, 10).until();
		}

		if (!this.intentIqObject) {
			const domainName = window.location.hostname.includes('.fandom.com')
				? 'fandom.com'
				: window.location.hostname;

			return new Promise((resolve) => {
				this.intentIqObject = new window.IntentIqObject({
					partner: this.fandomId,
					pbjs,
					timeoutInMillis: DEFAULT_MAX_DELAY,
					ABTestingConfigurationSource: 'percentage',
					abPercentage: 90,
					manualWinReportEnabled: true,
					browserBlackList: 'Chrome',
					domainName,
					callback: (data) => {
						utils.logger(logGroup, 'got data', data);
						return resolve();
					},
				});
				targetingService.set(
					'intent_iq_group',
					this.intentIqObject.intentIqConfig.abTesting.currentTestGroup || 'U',
				);
			});
		}
	}

	async reportPrebidWin(slotAlias: string, winningBid: PrebidTargeting): Promise<void> {
		if (!this.isEnabled() || !this.intentIqObject) {
			return;
		}

		const bids = await getAvailableBidsByAdUnitCode(slotAlias);
		if (!bids.length) {
			return;
		}

		const winningBidResponse = bids.filter((bid) => bid.adId === winningBid.hb_adid).shift();
		if (!winningBidResponse) {
			return;
		}

		const data: IntentIQReportData = {
			biddingPlatformId: 1, // Prebid
			bidderCode: winningBidResponse.bidderCode,
			prebidAuctionId: winningBidResponse.auctionId,
			cpm: winningBidResponse.cpm,
			currency: winningBidResponse.currency,
			originalCpm: winningBidResponse.originalCpm,
			originalCurrency: winningBidResponse.originalCurrency,
			status: winningBidResponse.status,
			placementId: winningBidResponse.adUnitCode,
		};

		utils.logger(logGroup, 'reporting prebid win', data);

		this.intentIqObject.reportExternalWin(data);

		externalLogger.log('intentiq report', { report: JSON.stringify(data) });
	}

	private isEnabled(): boolean {
		return (
			context.get('bidders.prebid.intentIQ') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!utils.isCoppaSubject()
		);
	}
}

export const intentIQ = new IntentIQ();
