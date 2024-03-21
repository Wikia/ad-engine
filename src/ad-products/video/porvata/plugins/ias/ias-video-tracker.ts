import { utils } from '@ad-engine/core';

const scriptUrl = '//static.adsafeprotected.com/vans-adapter-google-ima.js';

class IasVideoTracker {
	private scriptPromise: Promise<Event>;

	load(): Promise<Event> {
		if (!this.scriptPromise) {
			this.scriptPromise = utils.scriptLoader.loadScript(scriptUrl, true, 'first');
		}

		return this.scriptPromise;
	}
}

export const iasVideoTracker = new IasVideoTracker();
