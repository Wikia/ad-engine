import { communicationService, context, globalAction, ofType, utils } from '@wikia/ad-engine';
import { take } from 'rxjs/operators';
import { props } from 'ts-action';

interface GdprConsentPayload {
	gdprConsent: boolean;
	geoRequiresConsent: boolean;
}

interface CcpaSignalPayload {
	ccpaSignal: boolean;
	geoRequiresSignal: boolean;
}

const setOptIn = globalAction(
	'[AdEngine OptIn] set opt in',
	props<GdprConsentPayload & CcpaSignalPayload>(),
);

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
		return new Promise(async (resolve) => {
			utils.logger(logGroup, 'Waiting for consents');

			communicationService.action$.pipe(ofType(setOptIn), take(1)).subscribe((action) => {
				this.setConsents(action);
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

		communicationService.action$.pipe(ofType(setOptIn), take(1)).subscribe((consents) => {
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
