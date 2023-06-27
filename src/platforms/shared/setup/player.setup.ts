import {
	BaseServiceSetup,
	communicationService,
	JWPlayerManager,
	jwpSetup,
} from '@wikia/ad-engine';

export class PlayerSetup extends BaseServiceSetup {
	call() {
		new JWPlayerManager().manage();
		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
	}
}
