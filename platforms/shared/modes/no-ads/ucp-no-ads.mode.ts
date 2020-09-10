import { communicationService, DiProcess, jwpSetup } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsDetector } from '../../services/no-ads-detector';
import { PageTracker } from '../../tracking/page-tracker';

@Injectable()
export class UcpNoAdsMode implements DiProcess {
	constructor(private pageTracker: PageTracker, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		this.dispatchJWPlayerSetupAction();
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `off_${this.noAdsDetector.getReasons()[0]}`);
	}

	private dispatchJWPlayerSetupAction(): void {
		communicationService.dispatch(jwpSetup({ showAds: false, autoplayDisabled: false }));
	}
}
