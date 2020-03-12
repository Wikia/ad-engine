import { NoAdsMode } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';
import { Communicator } from '@wikia/post-quecast';

@Injectable()
export class UcpNoAdsMode implements NoAdsMode {
	handleNoAds(): void {
		this.dispatchJWPlayerSetupAction(false);
	}

	private dispatchJWPlayerSetupAction(showAds = false): void {
		const communicator = new Communicator();

		communicator.dispatch({
			showAds,
			type: '[Ad Engine] Setup JWPlayer',
			autoplayDisabled: false,
		});
	}
}
