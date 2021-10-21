import { context, utils } from '@ad-engine/core';
import { PorvataPlayer } from '../../porvata-player';
import { PorvataSettings } from '../../porvata-settings';
import { PorvataPlugin } from '../porvata-plugin';
import { initMoatTracking } from './moat-video-tracker-script';

const logGroup = 'moat-video-tracker';

interface MoatConfig {
	partnerCode: string;
	slicer1: string;
	slicer2: string;
	viewMode: google.ima.ViewMode;
}

class MoatVideoTracker implements PorvataPlugin {
	isEnabled(videoSettings: PorvataSettings): boolean {
		return videoSettings.isMoatTrackingEnabled();
	}

	load() {
		return Promise.resolve();
	}

	init(player: PorvataPlayer, settings: PorvataSettings): Promise<void> {
		try {
			initMoatTracking(
				player.getAdsManager(),
				this.getConfig(settings),
				player.dom.getVideoContainer(),
			);
			utils.logger(logGroup, 'MOAT video tracking initialized');
		} catch (error) {
			utils.logger(logGroup, 'MOAT video tracking initalization error', error);
		}

		return Promise.resolve();
	}

	private getConfig(settings: PorvataSettings): MoatConfig {
		return {
			partnerCode: context.get('options.video.moatTracking.partnerCode'),
			slicer1: settings.getSrc(),
			slicer2: `${settings.getAdProduct()}/${settings.getSlotName()}`,
			viewMode: window.google.ima.ViewMode.NORMAL,
		};
	}
}

export const moatVideoTracker = new MoatVideoTracker();
