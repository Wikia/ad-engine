import {
	CcpaSignalPayload,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	GdprConsentPayload,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'tracking-opt-in-wrapper';

/**
 * Wraps all functionality for the consent management system
 */
@Injectable()
export class ConsentManagementPlatformSetup implements DiProcess {
	constructor() {
		window.ads = window.ads || ({} as MediaWikiAds);

		this.installConsentQueue();
	}

	async execute(): Promise<void> {
		return new Promise((resolve) => {
			utils.logger(logGroup, 'Waiting for consents');

			communicationService.on(eventsRepository.AD_ENGINE_CONSENT_READY, (payload) => {
				this.setConsents(payload);
				resolve();
			});
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
