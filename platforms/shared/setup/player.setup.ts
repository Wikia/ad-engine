import {
	bidders,
	communicationService,
	JWPlayerManager,
	jwpSetup,
	PartnerServiceStage,
	Service,
	silverSurferService,
	taxonomyServiceDeprecated,
} from '@wikia/ad-engine';
import { wadRunnerDeprecated } from '../services/wad-runner-deprecated';

@Service({
	stage: PartnerServiceStage.preProvider,
	dependencies: [bidders, taxonomyServiceDeprecated, silverSurferService, wadRunnerDeprecated],
})
class PlayerSetup {
	call() {
		new JWPlayerManager().manage();

		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
	}
}

export const playerSetup = new PlayerSetup();
