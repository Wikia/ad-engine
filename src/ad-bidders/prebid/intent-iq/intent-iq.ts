import { context, DEFAULT_MAX_DELAY, targetingService, utils } from '@ad-engine/core';
import { getAvailableBidsByAdUnitCode } from '../prebid-helper';

const logGroup = 'IntentIQ';

export class IntentIQ {
	private fandomId = 1187275693;
	private intentIQScriptUrl =
		'//script.wikia.nocookie.net/fandom-ae-assets/platforms/dev/ADEN-12643/intentiq/IIQUniversalID.js';
	private intentIqObject: IntentIqObject;

	async initialize(pbjs: Pbjs): Promise<void> {
		if (!context.get('bidders.prebid.intentIQ')) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.intentIqObject) {
			await utils.scriptLoader.loadScript(this.intentIQScriptUrl, 'text/javascript', true, 'first');
			utils.logger(logGroup, 'loaded');

			const domainName = window.location.hostname.includes('.fandom.com')
				? 'fandom.com'
				: window.location.hostname;

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
				},
			});

			targetingService.set(
				'intent_iq_group',
				this.intentIqObject.intentIqConfig.abTesting.currentTestGroup || 'U',
			);
		}
	}

	async reportPrebidWin(slotAlias: string, winningBid: PrebidTargeting): Promise<void> {
		if (!context.get('bidders.prebid.intentIQ') || !this.intentIqObject) {
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
	}
}

export const intentIQ = new IntentIQ();
