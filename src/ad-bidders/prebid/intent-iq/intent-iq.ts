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
	private loaded = false;
	private pbjs: Pbjs;
	private fandomId = 1187275693;
	private intentIQScriptUrl =
		'//script.wikia.nocookie.net/fandom-ae-assets/intentiq/5.4/IIQUniversalID.js';
	private intentIqObject: IntentIqObject;

	async preloadScript(pbjs: Pbjs): Promise<void> {
		if (this.loaded) {
			return;
		}

		await utils.scriptLoader.loadScript(this.intentIQScriptUrl, 'text/javascript', true, 'first');
		this.loaded = true;
		this.pbjs = pbjs;
		utils.logger(logGroup, 'loaded');
	}

	async initialize(): Promise<void> {
		await new utils.WaitFor(() => window.IntentIqObject !== undefined, 10, 50).until();

		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.intentIqObject) {
			const domainName = window.location.hostname.includes('.fandom.com')
				? 'fandom.com'
				: window.location.hostname;

			this.intentIqObject = new window.IntentIqObject({
				partner: this.fandomId,
				pbjs: this.pbjs,
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
			this.loaded &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!utils.isCoppaSubject()
		);
	}
}

export const intentIQ = new IntentIQ();
