import { communicationService, DiProcess, jwpSetup } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { PageTracker } from '../../tracking/page-tracker';
import { NoAdsDetector } from '../../services/no-ads-detector';

@Injectable()
export class NoAdsMode implements DiProcess {
	constructor(private pageTracker: PageTracker, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		this.removeAdSlotsPlaceholders();
		this.dispatchJWPlayerSetupAction();
		this.trackAdEngineStatus();
	}

	private removeAdSlotsPlaceholders(): void {
		const placeholders = document.querySelectorAll('.ad-slot-placeholder');
		placeholders.forEach((placeholder) => {
			placeholder.parentElement.remove();
		});
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `off_${this.noAdsDetector.getReasons()[0]}`);
	}

	private dispatchJWPlayerSetupAction(): void {
		communicationService.dispatch(jwpSetup({ showAds: false, autoplayDisabled: false }));
	}
}
