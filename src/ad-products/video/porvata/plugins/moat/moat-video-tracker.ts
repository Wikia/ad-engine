import { context, utils } from '@ad-engine/core';
import { VideoSettings } from '../../video-settings';
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
	isEnabled(videoSettings: VideoSettings): boolean {
		return videoSettings.isMoatTrackingEnabled();
	}

	load() {
		return Promise.resolve();
	}

	init(adsManager: google.ima.AdsManager, videoSettings: VideoSettings): Promise<void> {
		try {
			initMoatTracking(adsManager, this.getConfig(videoSettings), videoSettings.getContainer());
			utils.logger(logGroup, 'MOAT video tracking initialized');
		} catch (error) {
			utils.logger(logGroup, 'MOAT video tracking initalization error', error);
		}

		return Promise.resolve();
	}

	private getConfig(videoSettings: VideoSettings): MoatConfig {
		return {
			partnerCode: context.get('options.video.moatTracking.partnerCode'),
			slicer1: videoSettings.get('src'),
			slicer2: `${videoSettings.get('adProduct')}/${videoSettings.get('slotName')}`,
			viewMode: window.google.ima.ViewMode.NORMAL,
		};
	}
}

export const moatVideoTracker = new MoatVideoTracker();
