import { context } from '../../../../services';
import { logger } from '../../../../utils';
import { initMoatTracking } from './moat-video-tracker-script';

const logGroup = 'moat-video-tracker';

class MoatVideoTracker {
	init(
		adsManager: google.ima.AdsManager,
		container: HTMLElement,
		viewMode: google.ima.ViewMode,
		slicer1: string,
		slicer2: string,
	) {
		const ids = {
			slicer1,
			slicer2,
			viewMode,
			partnerCode: context.get('options.video.moatTracking.partnerCode'),
		};

		try {
			initMoatTracking(adsManager, ids, container);
			logger(logGroup, 'MOAT video tracking initialized');
		} catch (error) {
			logger(logGroup, 'MOAT video tracking initalization error', error);
		}
	}
}

export const moatVideoTracker = new MoatVideoTracker();
