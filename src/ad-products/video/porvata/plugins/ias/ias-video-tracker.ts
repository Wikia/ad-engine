import { context, slotService, utils } from '@ad-engine/core';
import { PorvataPlayer } from '../../porvata-player';
import { PorvataSettings } from '../../porvata-settings';
import { PorvataPlugin } from '../porvata-plugin';

const scriptUrl = '//static.adsafeprotected.com/vans-adapter-google-ima.js';
const logGroup = 'ias-video-tracking';

interface IasConfig {
	anId: string;
	campId: string;
	chanId?: string;
	pubOrder?: any;
	placementId?: string;
	pubCreative?: string;
	pubId?: string;
	custom?: string;
	custom2?: string;
	custom3?: string;
}

class IasVideoTracker implements PorvataPlugin {
	private scriptPromise: Promise<Event>;

	isEnabled(videoSettings: PorvataSettings) {
		return videoSettings.isIasTrackingEnabled();
	}

	load(): Promise<Event> {
		if (!this.scriptPromise) {
			this.scriptPromise = utils.scriptLoader.loadScript(
				scriptUrl,
				'text/javascript',
				true,
				'first',
			);
		}

		return this.scriptPromise;
	}

	init(player: PorvataPlayer, settings: PorvataSettings): Promise<void> {
		return this.load().then(() => {
			const config: IasConfig = context.get('options.video.iasTracking.config');
			const slotName = settings.getSlotName();
			const { src, pos, loc } = slotService.get(slotName).getTargeting();

			config.custom = src;
			config.custom2 = pos;
			config.custom3 = loc;

			utils.logger(logGroup, 'ready');

			window.googleImaVansAdapter.init(
				window.google,
				player.getAdsManager(),
				player.dom.getVideoContainer(),
				config,
			);
		});
	}
}

export const iasVideoTracker = new IasVideoTracker();
