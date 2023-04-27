import { context, DEFAULT_MAX_DELAY, utils } from '@ad-engine/core';
import { getAvailableBidsByAdUnitCode } from '../prebid-helper';

const logGroup = 'IntentIQ';

export class IntentIQ {
	private fandomId = 1187275693;
	private intentIQScriptUrl =
		'https://iiq-be-js-sdk.s3.amazonaws.com/GA/UniversalID/IIQUniversalID.js';
	private isLoaded = false;
	private intentIqObject: any;

	async initialize(pbjs: Pbjs): Promise<void> {
		if (!context.get('bidders.prebid.intentIQ')) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.isLoaded) {
			await utils.scriptLoader.loadScript(this.intentIQScriptUrl, 'text/javascript', true, 'first');
			this.isLoaded = true;
			utils.logger(logGroup, 'loaded');
		}

		if (!this.intentIqObject) {
			this.intentIqObject = new window.IntentIqObject({
				partner: this.fandomId,
				pbjs,
				timeoutInMillis: DEFAULT_MAX_DELAY,
				ABTestingConfigurationSource: 'percentage',
				abPercentage: 90,
				manualWinReportEnabled: true,
				callback: (data) => {
					utils.logger(logGroup, 'got data', data);
				},
			});
		}
	}

	async reportPrebidWin(slotAlias: string, winningBid: PrebidTargeting): Promise<void> {
		if (!(context.get('bidders.prebid.intentIQ') && this.isLoaded && this.intentIqObject)) {
			return;
		}
		const bids = await getAvailableBidsByAdUnitCode(slotAlias);
		if (!bids.length) {
			return;
		}

		const winningBidResponse = bids.filter((bid) => bid.adId === winningBid.hb_adid);

		if (!winningBidResponse.length) {
			return;
		}

		const domainName = window.location.hostname.includes('.fandom.com')
			? 'fandom.com'
			: window.location.hostname;
		const data: IntentIQReportData = {
			biddingPlatformId: 1, // Prebid
			bidderCode: winningBidResponse[0].bidderCode,
			prebidAuctionId: winningBidResponse[0].auctionId,
			cpm: winningBidResponse[0].cpm,
			currency: winningBidResponse[0].currency,
			originalCpm: winningBidResponse[0].originalCpm,
			originalCurrency: winningBidResponse[0].originalCurrency,
			status: winningBidResponse[0].status,
			placementId: winningBidResponse[0].adUnitCode,
			domainName,
		};

		utils.logger(logGroup, 'reporting prebid win', data);

		this.intentIqObject.reportExternalWin(data);
	}
}

export const intentIQ = new IntentIQ();
