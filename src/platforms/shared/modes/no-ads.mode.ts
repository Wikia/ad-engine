import {
	CcpaSignalPayload,
	communicationService,
	eventsRepository,
	GdprConsentPayload,
} from '@ad-engine/communication';
import { context } from '@ad-engine/core';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { Apstag } from '@wikia/ad-bidders';
import { jwpSetup } from '@wikia/ad-products';
import { Ats, Audigent, Experian, Eyeota, LiveConnect, LiveRampPixel } from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsDetector } from '../services/no-ads-detector';

@Injectable()
export class NoAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private noAdsDetector: NoAdsDetector,
		private ats: Ats,
		private audigent: Audigent,
		private eyeota: Eyeota,
		private liveConnect: LiveConnect,
		private experian: Experian,
		private liveRampPixel: LiveRampPixel,
	) {}

	execute(): void {
		this.removeAdSlotsPlaceholders();
		this.noAdsDetector.addReasons(window.ads.context.opts.noAdsReasons);
		this.dispatchJWPlayerSetupAction();
		this.dispatchVideoSetupAction();
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
			.add(
				this.liveRampPixel,
				this.ats,
				this.audigent,
				this.eyeota,
				this.liveConnect,
				this.experian,
			)
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

	private dispatchVideoSetupAction(): void {
		communicationService.emit(eventsRepository.VIDEO_SETUP, {
			showAds: false,
			autoplayDisabled: false,
		});
	}
}
