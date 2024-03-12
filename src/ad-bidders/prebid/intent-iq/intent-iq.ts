import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, DEFAULT_MAX_DELAY, externalLogger, targetingService } from '@ad-engine/core';
import { isCoppaSubject, logger, scriptLoader, WaitFor } from '@ad-engine/utils';

const logGroup = 'IntentIQ';

export class IntentIQ {
	private loadPromise: Promise<void>;
	private loaded = false;
	private fandomId = 1187275693;
	private intentIQScriptUrl =
		'//script.wikia.nocookie.net/fandom-ae-assets/intentiq/5.4/IIQUniversalID.js';
	private intentIqObject: IntentIqObject;

	preloadScript(): Promise<void> {
		if (!this.isEnabled()) {
			return;
		}
		if (this.loadPromise) {
			return this.loadPromise;
		}

		this.loadPromise = scriptLoader.loadScript(this.intentIQScriptUrl, true, 'first').then(() => {
			this.loaded = true;
			logger(logGroup, 'loaded');
		});
	}

	async initialize(pbjs: Pbjs): Promise<void> {
		if (!this.isEnabled()) {
			logger(logGroup, 'disabled');
			return;
		}

		if (!this.loaded) {
			await this.preloadScript();
			await new WaitFor(() => window.IntentIqObject !== undefined, 10, 10).until();
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
					abPercentage: 97,
					manualWinReportEnabled: true,
					browserBlackList: 'Chrome',
					domainName,
					callback: (data) => {
						logger(logGroup, 'got data', data);
						resolve();
					},
				});
				const abTestGroup = this.intentIqObject.intentIqConfig.abTesting.currentTestGroup || 'U';
				targetingService.set('intent_iq_group', abTestGroup);
				communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
					status: 'intentiq_done',
				});
				communicationService.emit(eventsRepository.INTENT_IQ_GROUP_OBTAINED, {
					abTestGroup,
				});
			});
		}
	}

	async reportPrebidWin(bid: PrebidBidResponse): Promise<void> {
		if (!this.isEnabled() || !this.intentIqObject) {
			return;
		}

		const data: IntentIQReportData = {
			biddingPlatformId: 1, // Prebid
			bidderCode: bid.bidderCode,
			prebidAuctionId: bid.auctionId,
			cpm: bid.cpm,
			currency: bid.currency,
			originalCpm: bid.originalCpm,
			originalCurrency: bid.originalCurrency,
			status: bid.status,
			placementId: bid.adUnitCode,
		};

		logger(logGroup, 'reporting prebid win', data);

		this.intentIqObject.reportExternalWin(data);

		externalLogger.log('intentiq report', { report: JSON.stringify(data) });
	}

	isEnabled(): boolean {
		return (
			context.get('bidders.prebid.intentIQ') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!isCoppaSubject()
		);
	}
}

export const intentIQ = new IntentIQ();
