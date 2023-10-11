import {
	Audigent,
	communicationService,
	DiProcess,
	eventsRepository,
	Experian,
	Eyeota,
	jwpSetup,
	LiveConnect,
	LiveRampPixel,
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
		private eyeota: Eyeota,
		private liveConnect: LiveConnect,
		private experian: Experian,
		private liveRampPixel: LiveRampPixel,
	) {}

	execute(): void {
		this.removeAdSlotsPlaceholders();
		this.noAdsDetector.addReasons(window.ads.context.opts.noAdsReasons);
		this.dispatchJWPlayerSetupAction();

		this.pipeline
			.add(this.liveRampPixel, this.audigent, this.eyeota, this.liveConnect, this.experian)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
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
