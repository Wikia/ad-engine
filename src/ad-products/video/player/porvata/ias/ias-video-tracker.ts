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
	custom?: string;
	custom2?: string;
	custom3?: string;
}

class IasVideoTracker {
	private scriptPromise: Promise<Event>;

	loadScript(): Promise<Event> {
		if (!this.scriptPromise) {
			this.scriptPromise = utils.scriptLoader.loadScript(
				scriptUrl,
				'text/javascript',
				true,
				'first',
			);
		}

		return this.scriptPromise;
	}

	init(
		google,
		adsManager: google.ima.AdsManager,
		videoElement: HTMLElement,
		config: IasTrackingParams,
	): Promise<void> {
		return this.loadScript().then(() => {
			utils.logger(logGroup, 'ready');

			window.googleImaVansAdapter.init(google, adsManager, videoElement, config);
		});
	}
}

export const iasVideoTracker = new IasVideoTracker();
