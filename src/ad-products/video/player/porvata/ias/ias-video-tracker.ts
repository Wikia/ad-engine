import { context, utils } from '@ad-engine/core';

const logGroup = 'ias-video-tracking';

function loadScript() {
	const anId = context.get('options.video.iasTracking.anid');
	utils.logger(logGroup, 'testing');
}

class IasVideoTracker {
	init(): void {
		loadScript();
	}
}

export const iasVideoTracker = new IasVideoTracker();
