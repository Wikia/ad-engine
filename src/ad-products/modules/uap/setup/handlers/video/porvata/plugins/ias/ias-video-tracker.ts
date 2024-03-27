// @ts-strict-ignore
import { PorvataPlayer } from '../../porvata-player';
import { PorvataSettings } from '../../porvata-settings';
import { PorvataPlugin } from '../porvata-plugin';
import { scriptLoader } from "../../../../../../../../../core/utils/script-loader";
import { logger } from "../../../../../../../../../core/utils/logger";
import { communicationServiceSlim } from "../../../../../../utils/communication-service-slim";
import { eventsRepository } from "../../../../../../../../../communication/event-types";
import { SlotTargeting, targetingService } from "../../../../../../../../../core/services/targeting-service";
import { parseTargetingParams } from "../../../../helpers/parsing-targeting-params";
import { context } from "../../../../../../../../../core/services/context-service";

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

	isEnabled(videoSettings: PorvataSettings): boolean {
		return videoSettings.isIasTrackingEnabled();
	}

	load(): Promise<Event> {
		if (!this.scriptPromise) {
			this.scriptPromise = scriptLoader.loadScript(scriptUrl, true, 'first');
		}

		return this.scriptPromise;
	}

	init(player: PorvataPlayer, settings: PorvataSettings): Promise<void> {
		communicationServiceSlim.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'ias_start',
		});
		return this.load().then(() => {
			const config: IasConfig = context.get('options.video.iasTracking.config');
			const slotName = settings.getSlotName();

			const slotTargeting = targetingService.dump<SlotTargeting>(slotName);
			const { src, pos, loc } = parseTargetingParams(slotTargeting);

			config.custom = src;
			config.custom2 = pos;
			config.custom3 = loc;

			logger(logGroup, 'ready');

			window.googleImaVansAdapter.init(
				window.google,
				player.getAdsManager(),
				player.dom.getVideoContainer(),
				config,
			);

			communicationServiceSlim.emit(eventsRepository.PARTNER_LOAD_STATUS, {
				status: 'ias_done',
			});
		});
	}
}

export const iasVideoTracker = new IasVideoTracker();
