import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, externalLogger, pbjsFactory, targetingService, utils } from '@ad-engine/core';

const logGroup = 'IntentIQ';

export class IntentIQ {
	private loadPromise: Promise<void>;
	private fandomId = 1187275693;
	private intentIQScriptUrl =
		'//script.wikia.nocookie.net/fandom-ae-assets/intentiq/5.4/IIQUniversalID.js';
	private intentIqObject: IntentIqObject;

	load(): Promise<void> {
		if (this.loadPromise) {
			return this.loadPromise;
		}

		this.loadPromise = utils.scriptLoader
			.loadScript(this.intentIQScriptUrl, true, 'first')
			.then(() => {
				utils.logger(logGroup, 'loaded');
				return this.init();
			});
		return this.loadPromise;
	}

	private async init() {
		return pbjsFactory.init().then((pbjs: Pbjs) => {
			communicationService.on(eventsRepository.AD_ENGINE_CONSENT_READY, () => {
				pbjs.onEvent(
					'adRenderSucceeded',
					(response: { adId: string; bid: PrebidBidResponse; doc: Document | null }) =>
						this.reportPrebidWin(response.bid),
				);
				this.callIntentIq(pbjs);
			});
		});
	}

	private callIntentIq(pbjs: Pbjs): void {
		if (!window.IntentIqObject) {
			utils.logger(logGroup, 'no IntentIqObject available!');
			communicationService.emit(eventsRepository.INTENTIQ_NOT_LOADED);
		}
		if (!this.intentIqObject) {
			communicationService.emit(eventsRepository.INTENTIQ_STARTED);

			const domainName = window.location.hostname.includes('.fandom.com')
				? 'fandom.com'
				: window.location.hostname;

			this.intentIqObject = new window.IntentIqObject({
				partner: this.fandomId,
				pbjs,
				timeoutInMillis: context.get('services.intentIq.timeout') || 2000,
				ABTestingConfigurationSource: 'percentage',
				abPercentage: 97,
				manualWinReportEnabled: true,
				browserBlackList: 'Chrome',
				domainName,
				callback: (data) => {
					communicationService.emit(eventsRepository.INTENTIQ_RESOLVED);
					utils.logger(logGroup, 'got data', data);
				},
			});
			targetingService.set(
				'intent_iq_group',
				this.intentIqObject.intentIqConfig.abTesting.currentTestGroup || 'U',
			);
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

		utils.logger(logGroup, 'reporting prebid win', data);

		this.intentIqObject.reportExternalWin(data);

		externalLogger.log('intentiq report', { report: JSON.stringify(data) });
	}

	isEnabled(): boolean {
		return (
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!utils.isCoppaSubject()
		);
	}
}

export const intentIQ = new IntentIQ();
