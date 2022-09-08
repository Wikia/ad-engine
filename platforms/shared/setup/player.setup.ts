import {
	bidders,
	communicationService,
	context,
	JWPlayerManager,
	jwpSetup,
	ServiceStage,
	Service,
} from '@wikia/ad-engine';
import { wadRunner } from '../services/wad-runner';

@Service({
	stage: ServiceStage.preProvider,
	dependencies: [bidders, wadRunner],
	timeout: context.get('options.jwpMaxDelayTimeout'),
})
class PlayerSetup {
	call() {
		new JWPlayerManager().manage();

		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
	}
}

export const playerSetup = new PlayerSetup();
