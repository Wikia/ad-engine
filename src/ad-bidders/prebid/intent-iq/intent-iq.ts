import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	context,
	DEFAULT_MAX_DELAY,
	externalLogger,
	targetingService,
	utils,
} from '@ad-engine/core';

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
					abPercentage: 97,
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

		if (this.isEnabled() && context.get('services.intentIq.ppid')) {
			const ppid = this.getPPID();
			if (ppid) {
				this.setPpid(ppid);
				this.trackPpid(ppid);
			}
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

	private isEnabled(): boolean {
		return (
			context.get('bidders.prebid.intentIQ') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!utils.isCoppaSubject()
		);
	}

	private getPPID(): string | undefined {
		try {
			const ppid = this.extractIIQ_ID(this.intentIqObject.getIntentIqData());

			if (ppid) {
				utils.logger(logGroup, 'ppid received', ppid);
				return ppid;
			}
		} catch (error) {
			utils.warner(logGroup, 'error setting ppid', error);
		}
	}

	private setPpid(ppid: string) {
		targetingService.set('intent_iq_ppid', ppid);
		utils.logger(logGroup, 'ppid set', ppid);
	}

	private extractIIQ_ID(json) {
		const eids = json.eids;
		for (let i = 0; i < eids.length; i++) {
			const eid = eids[i];
			if (eid.source === 'intentiq.com') {
				const uids = eid.uids;
				for (let j = 0; j < uids.length; j++) {
					const uid = uids[j];
					if (uid.ext.stype === 'ppuid') {
						return uid.id;
					}
				}
			}
		}

		return null;
	}

	private trackPpid(ppid: string) {
		communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
			partnerName: 'intentiq',
			partnerIdentityId: ppid,
		});
	}
}

export const intentIQ = new IntentIQ();
