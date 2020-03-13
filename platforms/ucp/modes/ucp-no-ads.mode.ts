import { NoAdsMode } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';
import { Communicator } from '@wikia/post-quecast';

@Injectable()
export class UcpNoAdsMode implements NoAdsMode {
	handleNoAds(): void {
		this.dispatchJWPlayerSetupAction();
	}

	private dispatchJWPlayerSetupAction(): void {
		const communicator = new Communicator();

		communicator.dispatch({
			type: '[Ad Engine] Setup JWPlayer',
			showAds: false,
			autoplayDisabled: false,
		});
	}
}
