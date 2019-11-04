import { utils } from '@ad-engine/core';

const scriptUrl = '//static.adsafeprotected.com/vans-adapter-google-ima.js';
const logGroup = 'ias-video-tracking';

export interface IasTrackingParams {
	anId: string;
	campId: string;
	chanId?: string;
	pubOrder?: any;
	placementId?: string;
	pubCreative?: string;
	pubId?: string;
	custom?: any;
}

class IasVideoTracker {
	private scriptPromise = null;

	loadScript(): void {
		this.scriptPromise = utils.scriptLoader.loadScript(scriptUrl, 'text/javascript', true, 'first');
	}

	init(
		google,
		adsManager: google.ima.AdsManager,
		videoElement: HTMLElement,
		config: IasTrackingParams,
	): void {
		if (this.scriptPromise === null) {
			this.loadScript();
		}

		this.scriptPromise.then(() => {
			utils.logger(logGroup, 'ready');

			window.googleImaVansAdapter.init(google, adsManager, videoElement, config);
		});
	}
}

export const iasVideoTracker = new IasVideoTracker();
