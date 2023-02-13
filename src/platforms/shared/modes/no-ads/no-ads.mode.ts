import {
	Ats,
	Audigent,
	communicationService,
	DiProcess,
	eventsRepository,
	IdentityHub,
	jwpSetup,
	LiveConnect,
	LiveRampPixel,
	PartnerPipeline,
	UserIdentity,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { NoAdsDetector } from '../../services/no-ads-detector';

@injectable()
export class NoAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private noAdsDetector: NoAdsDetector,
		private ats: Ats,
		private audigent: Audigent,
		private identityHub: IdentityHub,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private userIdentity: UserIdentity,
	) {}

	execute(): void {
		this.removeAdSlotsPlaceholders();
		this.noAdsDetector.addReasons(window.ads.context.opts.noAdsReasons);
		this.dispatchJWPlayerSetupAction();

		this.pipeline
			.add(
				this.userIdentity,
				this.liveRampPixel.setOptions({ dependencies: [this.userIdentity.initialized] }),
				this.ats,
				this.audigent,
				this.liveConnect,
				this.identityHub,
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
