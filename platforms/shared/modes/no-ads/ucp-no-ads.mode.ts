import { communicationService, jwpSetup } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsDetector } from '../../services/no-ads-detector';
import { PageTracker } from '../../tracking/page-tracker';
import { NoAdsMode } from './_no-ads.mode';

@Injectable()
export class UcpNoAdsMode implements NoAdsMode {
	constructor(private pageTracker: PageTracker, private noAdsDetector: NoAdsDetector) {}

	handleNoAds(): void {
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
