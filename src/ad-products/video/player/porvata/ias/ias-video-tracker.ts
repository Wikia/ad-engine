import { utils } from '@ad-engine/core';

const logGroup = 'ias-video-tracking';

export interface IasTrackingParams {
	anId: string;
	campId: string;
	chanId?: string; // ad unit id
	pubOrder?: any;
	placementId?: string;
	pubCreative?: string;
	pubId?: string;
	custom?: any;
}

function loadScript() {
	const url = `//static.adsafeprotected.com/vans-adapter-google-ima.js`;

	return utils.scriptLoader.loadScript(url, 'text/javascript', true, 'first');
}

class IasVideoTracker {
	init(
		google,
		adsManager: google.ima.AdsManager,
		videoElement: HTMLElement,
		config: IasTrackingParams,
	): void {
		loadScript().then(() => {
			utils.logger(logGroup, 'ready');

			window.googleImaVansAdapter.init(google, adsManager, videoElement, config);
		});
	}
}

export const iasVideoTracker = new IasVideoTracker();
