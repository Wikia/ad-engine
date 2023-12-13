import {
	Apstag,
	Audigent,
	CcpaSignalPayload,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	GdprConsentPayload,
	jwpSetup,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsDetector } from '../services/no-ads-detector';

@Injectable()
export class NoAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private noAdsDetector: NoAdsDetector,
		private audigent: Audigent,
	) {}

	execute(): void {
		this.removeAdSlotsPlaceholders();
		this.noAdsDetector.addReasons(window.ads.context.opts.noAdsReasons);
		this.dispatchJWPlayerSetupAction();
		if (context.get('state.isLogged')) {
			const apstag = Apstag.make();
			apstag
				.init()
				.then(() =>
					communicationService.on(
						eventsRepository.AD_ENGINE_CONSENT_UPDATE,
						(consents: GdprConsentPayload & CcpaSignalPayload) =>
							apstag.sendHEM(apstag.getRecord(), consents),
						false,
					),
				);
		}

		this.pipeline
			.add(this.audigent)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
				communicationService.emit(eventsRepository.AD_ENGINE_STACK_START);
			});
	}

	private removeAdSlotsPlaceholders(): void {
		const placeholders = document.querySelectorAll(
			'.top-ads-container, .ad-slot-placeholder, .bottom-ads-container',
		);
		placeholders.forEach((placeholder) => {
			placeholder.remove();
		});
	}

	private dispatchJWPlayerSetupAction(): void {
		communicationService.dispatch(jwpSetup({ showAds: false, autoplayDisabled: false }));
	}
}
