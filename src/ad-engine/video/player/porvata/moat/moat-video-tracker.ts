import { logger } from '../../../../utils';
import { context } from '../../../../services';
import { initMoatTracking } from './moat-video-tracker-script';

const logGroup = 'moat-video-tracker';

class MoatVideoTracker {
	init(adsManager, container, viewMode, slicer1, slicer2) {
		const ids = {
			partnerCode: context.get('options.video.moatTracking.partnerCode'),
			viewMode,
			slicer1,
			slicer2,
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
