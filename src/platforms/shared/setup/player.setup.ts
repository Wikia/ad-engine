import {
	BaseServiceSetup,
	communicationService,
	context,
	InstantConfigService,
	JWPlayerManager,
	jwpSetup,
	Optimizely,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'player-setup';

@Injectable()
export class PlayerSetup extends BaseServiceSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: utils.GlobalTimeout,
		protected optimizely: Optimizely,
		protected jwpManager: JWPlayerManager,
	) {
		super(instantConfig, globalTimeout);
		this.jwpManager = jwpManager ? jwpManager : new JWPlayerManager();
	}

	call() {
		const showAds = !context.get('options.wad.blocking');
		const vastXml = utils.taglessRequestContext.getVideoVastXml();

		if (showAds) {
			utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');
			this.jwpManager.manage();
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastXml,
				}),
			);
		} else {
			utils.logger(logGroup, 'ad block detected, without ads');
			this.jwpManager.manage();
			communicationService.dispatch(
				jwpSetup({
					showAds: false,
					autoplayDisabled: false,
					vastXml,
				}),
			);
		}
	}
}
