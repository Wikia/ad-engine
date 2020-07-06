import { communicationService, context, globalAction, ofType, utils } from '@wikia/ad-engine';
import { take } from 'rxjs/operators';
import { props } from 'ts-action';

interface OptInInstances {
	gdpr: any;
	ccpa: any;
}

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

const setOptInInstances = globalAction(
	'[AdEngine OptIn] set opt in instances',
	props<OptInInstances>(),
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
		if (!window.navigator.cookieEnabled) {
			return this.handleDisabledCookies();
		}

		try {
			await Promise.race([this.loadTrackingOptInLibrary(), utils.timeoutReject(2000)]);
			await this.handleLibraryLoaded();
		} catch (e) {
			return this.handleLibraryTimeout();
		}
	}

	private handleDisabledCookies(): void {
		utils.logger(logGroup, 'Cookies are disabled. Ignoring CMP and USAPI consent checks.');
		this.dispatchConsents({
			gdprConsent: true,
			geoRequiresConsent: true,
			ccpaSignal: false,
			geoRequiresSignal: true,
		});
	}

	private async loadTrackingOptInLibrary(): Promise<void> {
		const trackingOptInLibraryUrl =
			'//origin-images.wikia.com/fandom-ae-assets/tracking-opt-in/v3.0.6/tracking-opt-in.min.js';

		await utils.scriptLoader.loadScript(trackingOptInLibraryUrl);
	}

	private handleLibraryTimeout(): void {
		utils.logger(logGroup, 'Timeout waiting for library to load.');
		this.dispatchConsents({
			gdprConsent: false,
			geoRequiresConsent: true,
			ccpaSignal: true,
			geoRequiresSignal: true,
		});
	}

	private async handleLibraryLoaded(): Promise<void> {
		const optInInstances = await this.initInstances();
		const gdpr = this.getConsent(optInInstances);
		const ccpa = this.getSignal(optInInstances);

		this.dispatchConsents({ ...gdpr, ...ccpa });
		this.dispatchInstances(optInInstances);
	}

	private initInstances(): Promise<OptInInstances> {
		return new Promise(async (resolve) => {
			const disableConsentQueue = !!context.get('options.disableConsentQueue');

			utils.logger(logGroup, 'Modal library loaded');

			const optInInstances: OptInInstances = window.trackingOptIn.default({
				disableConsentQueue,
				enableCCPAinit: true,
				isSubjectToCcpa: window.ads.context && window.ads.context.opts.isSubjectToCcpa,
				onAcceptTracking: () => {
					utils.logger(logGroup, 'GDPR Consent');
					resolve(optInInstances);
				},
				onRejectTracking: () => {
					utils.logger(logGroup, 'GDPR Non-consent');
					resolve(optInInstances);
				},
				zIndex: 9999999,
			});

			if (disableConsentQueue) {
				resolve(optInInstances);
			}
		});
	}

	private getConsent(optInInstances: OptInInstances): GdprConsentPayload {
		// Nothing is needed if the geo does not require any consent
		if (!optInInstances.gdpr.geoRequiresTrackingConsent()) {
			return {
				gdprConsent: true,
				geoRequiresConsent: false,
			};
		}

		if (optInInstances.gdpr.hasUserConsented() === undefined) {
			return {
				gdprConsent: false,
				geoRequiresConsent: true,
			};
		}

		const gdprConsent = optInInstances.gdpr.hasUserConsented();

		utils.logger(logGroup, `User consent: ${gdprConsent}`);

		return {
			gdprConsent,
			geoRequiresConsent: true,
		};
	}

	private getSignal(optInInstances: OptInInstances): CcpaSignalPayload {
		// Nothing is needed if the geo does not require any consent
		if (!optInInstances.ccpa.geoRequiresUserSignal()) {
			return {
				ccpaSignal: false,
				geoRequiresSignal: false,
			};
		}

		if (optInInstances.ccpa.hasUserProvidedSignal() === undefined) {
			return {
				ccpaSignal: true,
				geoRequiresSignal: true,
			};
		}

		const ccpaSignal = optInInstances.ccpa.hasUserProvidedSignal();

		utils.logger(logGroup, `User signal: ${ccpaSignal}`);

		return {
			ccpaSignal,
			geoRequiresSignal: true,
		};
	}

	private dispatchConsents(consents: GdprConsentPayload & CcpaSignalPayload): void {
		context.set('options.trackingOptIn', consents.gdprConsent);
		context.set('options.geoRequiresConsent', consents.geoRequiresConsent);
		context.set('options.optOutSale', consents.ccpaSignal);
		context.set('options.geoRequiresSignal', consents.geoRequiresSignal);

		communicationService.dispatch(setOptIn(consents));
	}

	private dispatchInstances(optInInstances: OptInInstances): void {
		communicationService.dispatch(setOptInInstances(optInInstances));
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
			window.ads.consentQueue.onItemFlush((callback) => callback(consents));
			window.ads.consentQueue.flush();
		});
	}
}

export const trackingOptInWrapper = new TrackingOptInWrapper();
