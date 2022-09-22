import {
	jwpSetup,
	communicationService,
	JWPlayerManager,
	context,
	Service,
	ServiceStage,
	bidders,
} from '@wikia/ad-engine';
import { wadRunner } from '../services/wad-runner';

@Service({
	stage: ServiceStage.preProvider,
	dependencies: [bidders, wadRunner],
	timeout: context.get('options.jwpMaxDelayTimeout'),
})
class PlayerSetup {
	call() {
		if (context.get('custom.hasFeaturedVideo')) {
			new JWPlayerManager().manage();
		}
		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
	}
}

export const playerSetup = new PlayerSetup();
