import {
	BaseServiceSetup,
	communicationService,
	context,
	JWPlayerManager,
	jwpSetup,
	utils,
} from '@wikia/ad-engine';

const logGroup = 'player-setup';

export class PlayerSetup extends BaseServiceSetup {
	call() {
		const showAds = !context.get('options.wad.blocking');

		if (showAds) {
			utils.logger(logGroup, 'with ads');
			new JWPlayerManager().manage();
		} else {
			utils.logger(logGroup, 'ad block detected, without ads');
		}
		communicationService.dispatch(jwpSetup({ showAds: showAds, autoplayDisabled: false }));
	}
}
