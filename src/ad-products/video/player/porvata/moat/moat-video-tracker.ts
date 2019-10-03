import { context, utils } from '@ad-engine/core';
import { initMoatTracking } from './moat-video-tracker-script';

const logGroup = 'moat-video-tracker';

class MoatVideoTracker {
	init(
		adsManager: google.ima.AdsManager,
		container: HTMLElement,
		viewMode: google.ima.ViewMode,
		slicer1: string,
		slicer2: string,
	): void {
		const ids = {
			slicer1,
			slicer2,
			viewMode,
			partnerCode: context.get('options.video.moatTracking.partnerCode'),
		};

		try {
			initMoatTracking(adsManager, ids, container);
			utils.logger(logGroup, 'MOAT video tracking initialized');
		} catch (error) {
			utils.logger(logGroup, 'MOAT video tracking initalization error', error);
		}
	}
}

export const moatVideoTracker = new MoatVideoTracker();
