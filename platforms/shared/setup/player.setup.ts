import {
	bidders,
	communicationService,
	context,
	JWPlayerManager,
	jwpSetup,
	PartnerServiceStage,
	Service,
	taxonomyService,
} from '@wikia/ad-engine';
import { wadRunner } from '../services/wad-runner';

@Service({
	stage: PartnerServiceStage.preProvider,
	dependencies: [bidders, taxonomyService, wadRunner],
	timeout: context.get('options.jwpMaxDelayTimeout'),
})
class PlayerSetup {
	call() {
		new JWPlayerManager().manage();

		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
	}
}

export const playerSetup = new PlayerSetup();
