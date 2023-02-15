import {
	CcpaSignalPayload,
	communicationService,
	context,
	eventsRepository,
	GdprConsentPayload,
	utils,
} from '@wikia/ad-engine';

const logGroup = 'tracking-opt-in-wrapper';

/**
 * Wraps all functionality for the consent management system
 */
class TrackingOptInWrapper {
	constructor() {
		window.ads = window.ads || ({} as MediaWikiAds);

		this.installConsentQueue();
	}

	async init(): Promise<void> {
		return new Promise((resolve) => {
			utils.logger(logGroup, 'Waiting for consents');

			this.setConsentsOnNoConsentModeEvent(resolve);

			this.setConsentsOnConsentReadyEvent(resolve);
		});
	}

	private setConsentsOnNoConsentModeEvent(resolve) {
		communicationService.on(eventsRepository.AD_ENGINE_NO_CONSENT_MODE, () => {
			utils.logger(logGroup, 'AdEngine running in no-consent mode');

			this.setConsents({
				gdprConsent: true,
				geoRequiresConsent: false,
				ccpaSignal: false,
				geoRequiresSignal: false,
			});

			resolve();
		});
	}

	private setConsentsOnConsentReadyEvent(resolve) {
		communicationService.on(eventsRepository.AD_ENGINE_CONSENT_READY, (payload) => {
			this.setConsents(payload);
			resolve();
		});
	}

	private setConsents(consents: GdprConsentPayload & CcpaSignalPayload): void {
		utils.logger(logGroup, 'TrackingOptIn consents', consents);

		context.set('options.trackingOptIn', consents.gdprConsent);
		context.set('options.geoRequiresConsent', consents.geoRequiresConsent);
		context.set('options.optOutSale', consents.ccpaSignal);
		context.set('options.geoRequiresSignal', consents.geoRequiresSignal);
	}

	/**
	 * @deprecated
	 */
	private installConsentQueue(): void {
		window.ads.consentQueue = new utils.LazyQueue<
			(callback: GdprConsentPayload & CcpaSignalPayload) => void
		>(...(window.ads.consentQueue || []));
		window.ads.pushToConsentQueue =
			window.ads.pushToConsentQueue ||
			((callback) => {
				window.ads.consentQueue.push(callback);
			});

		communicationService.on(eventsRepository.AD_ENGINE_CONSENT_READY, (consents) => {
			window.ads.consentQueue.onItemFlush((callback) => {
				console.warn(
					`[AdEngine] You are using deprecated API to get consent.\nPlease use PostQuecast action "[AdEngine OptIn] set opt in" instead.`,
				);
				callback(consents);
			});
			window.ads.consentQueue.flush();
		});
	}
}

export const trackingOptInWrapper = new TrackingOptInWrapper();
