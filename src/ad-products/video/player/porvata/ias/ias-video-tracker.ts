import { context, utils } from '@ad-engine/core';
import { initIASTracking } from './ias-video-tracker-script';

const logGroup = 'ias-video-tracking';

class IasVideoTracker {
	init(google, adsManager, videoElement, config): void {
		try {
			initIasTracking(google, adsManager, videoElement, config);
			utils.logger(logGroup, 'IAS video tracking initialized');
		} catch (error) {
			utils.logger(logGroup, 'IAS video tracking initalization error', error);
		}
	}
}

export const iasVideoTracker = new IasVideoTracker();
