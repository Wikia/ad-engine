import {
	BaseServiceSetup,
	communicationService,
	context,
	InstantConfigService,
	JWPlayerManager,
	jwpSetup,
	Optimizely,
	utils,
	VastResponseData,
	VastTaglessRequest,
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
		protected vastTaglessRequest: VastTaglessRequest,
	) {
		super(instantConfig, globalTimeout);
		this.jwpManager = jwpManager ? jwpManager : new JWPlayerManager();
	}

	async call() {
		const showAds = !context.get('options.wad.blocking');

		if (showAds) {
			utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');
			const vastResponse: VastResponseData =
				utils.displayAndVideoAdsSyncContext.isTaglessRequestEnabled()
					? await this.vastTaglessRequest.getVast(
							context.get('options.video.vastRequestTimeout') | 500,
					  )
					: undefined;

			if (vastResponse?.xml) {
				utils.displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			}
			this.jwpManager.manage();
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastXml: vastResponse?.xml,
				}),
			);
		} else {
			utils.logger(logGroup, 'ad block detected, without ads');
			this.jwpManager.manage();
			communicationService.dispatch(
				jwpSetup({
					showAds: false,
					autoplayDisabled: false,
				}),
			);
		}
	}
}
