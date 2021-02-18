import { NoAdsDetector, PageTracker } from '@platforms/shared';
import { communicationService, DiProcess, jwpSetup } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NoAdsMode implements DiProcess {
	constructor(private pageTracker: PageTracker, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		this.removeTLBPlaceholders();
		this.noAdsDetector.addReasons(window.ads.context.opts.noAdsReasons);
		this.dispatchJWPlayerSetupAction();
		this.trackAdEngineStatus();
	}

	private removeTLBPlaceholders(): void {
		const placeholders = document.querySelectorAll('.wrapper-gap.is-loading');
		placeholders.forEach((placeholder) => {
			placeholder.remove();
		});
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `off_${this.noAdsDetector.getReasons()[0]}`);
	}

	private dispatchJWPlayerSetupAction(): void {
		communicationService.dispatch(jwpSetup({ showAds: false, autoplayDisabled: false }));
	}
}
