import { utils } from '@ad-engine/core';

const logGroup = 'ias-video-tracking';

function loadScript() {
	const url = `https//static.adsafeprotected.com/vans-adapter-google-ima.js`;

	return utils.scriptLoader.loadScript(url, 'text/javascript', true, 'first');
}

class IasVideoTracker {
	init(): void {
		loadScript().then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
	//
	// call(): void {
	// 	window.googleImaVansAdapter()
	// }
}

export const iasVideoTracker = new IasVideoTracker();
