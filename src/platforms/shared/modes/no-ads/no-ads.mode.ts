import {
	ats,
	audigent,
	communicationService,
	DiProcess,
	eventsRepository,
	identityHub,
	jwpSetup,
	liveConnect,
	liveRampPixel,
	PartnerPipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsDetector } from '../../services/no-ads-detector';

@Injectable()
export class NoAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		this.removeAdSlotsPlaceholders();
		this.noAdsDetector.addReasons(window.ads.context.opts.noAdsReasons);
		this.dispatchJWPlayerSetupAction();

		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				ats,
				audigent,
				liveConnect,
				identityHub,
			)
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
