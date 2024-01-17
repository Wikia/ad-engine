import {
	BaseServiceSetup,
	communicationService,
	context,
	displayAndVideoAdsSyncContext,
	eventsRepository,
	InstantConfigService,
	JWPlayerManager,
	jwpSetup,
	Optimizely,
	utils,
	VastResponseData,
	VastTaglessRequest,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
// eslint-disable-next-line no-restricted-imports
import { iasVideoTracker } from '../../../ad-products/video/porvata/plugins/ias/ias-video-tracker';

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

	async execute(): Promise<void> {
		communicationService.on(eventsRepository.VIDEO_PLAYER_RENDERED, () => {
			this.loadIasTrackerIfEnabled();
		});
	}

	async call() {
		const showAds = !context.get('options.wad.blocking');

		if (showAds) {
			utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');

			const vastResponse: VastResponseData =
				displayAndVideoAdsSyncContext.isSyncEnabled() &&
				displayAndVideoAdsSyncContext.isTaglessRequestEnabled()
					? await this.vastTaglessRequest.getVast()
					: undefined;

			if (vastResponse?.xml) {
				displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
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

	private loadIasTrackerIfEnabled(): void {
		if (context.get('options.video.iasTracking.enabled')) {
			utils.logger(logGroup, 'Loading IAS tracker for video player');
			iasVideoTracker.load();
		}
	}
}
