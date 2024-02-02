import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, DEFAULT_MAX_DELAY, externalLogger, targetingService } from '@ad-engine/core';
import { isCoppaSubject, logger, scriptLoader, WaitFor, warner } from '@ad-engine/utils';

const logGroup = 'IntentIQ';

function isIntentIqData(data: IntentIqResponseData): data is IntentIqData {
	return !!data && data.eids !== undefined;
}

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
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'intentiq_ppid_not_set_on_time',
		});

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
						this.setupPpid(data);
					},
				});
				targetingService.set(
					'intent_iq_group',
					this.intentIqObject.intentIqConfig.abTesting.currentTestGroup || 'U',
				);
				if (context.get('services.intentIq.ppid.enabled')) {
					targetingService.set(
						'intent_iq_ppid_group',
						this.intentIqObject.intentIqConfig.abTesting.currentTestGroup || 'U',
					);
				}
				communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
					status: 'intentiq_done',
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

	setupPpid(data: IntentIqResponseData) {
		if (!this.isEnabled()) {
			return;
		}

		if (!isIntentIqData(data)) {
			logger(logGroup, 'no data received');
			return;
		}

		const ppid = this.getPpid(data);
		logger(logGroup, 'ppid', ppid);

		if (context.get('services.intentIq.ppid.enabled')) {
			this.setPpid(ppid);
		}
		if (context.get('services.intentIq.ppid.tracking.enabled')) {
			this.trackPpid(ppid);
		}
	}

	isEnabled(): boolean {
		return (
			context.get('bidders.prebid.intentIQ') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!isCoppaSubject()
		);
	}

	getPpid(data: IntentIqData): string | null {
		try {
			return this.extractId(data);
		} catch (error) {
			warner(logGroup, 'error setting ppid', error);
			return null;
		}
	}

	setPpid(ppid: string | null): void {
		targetingService.set('intent_iq_ppid', ppid, 'intent_iq');
		logger(logGroup, 'set ppid ', ppid);
	}

	private extractId(data: IntentIqData): string | null {
		return (
			data.eids
				.filter((eid) => eid.source === 'intentiq.com')
				.map((eid) => {
					return eid.uids.find((uid) => uid.ext.stype === 'ppuid');
				})[0]?.id ?? null
		);
	}

	trackPpid(ppid: string | null): void {
		if (!ppid) {
			return;
		}

		communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
			partnerName: 'intentiq',
			partnerIdentityId: ppid,
		});

		logger(logGroup, 'track ppid');
	}
}

export const intentIQ = new IntentIQ();
