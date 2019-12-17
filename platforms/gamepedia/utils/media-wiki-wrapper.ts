// RLQ may not exist as AdEngine is loading independently from Resource Loader
window.RLQ = window.RLQ || [];

class MediaWikiWrapper {
	ready: Promise<void>;

	constructor() {
		this.ready = new Promise<void>((resolve) =>
			window.RLQ.push(() => {
				if (window.mw.loader.using) {
					window.mw.loader.using('ext.track.scripts').then(resolve);
				} else {
					window.mw.loader.enqueue(['ext.track.scripts'], resolve);
				}
			}),
		);
	}
}

export const mediaWikiWrapper = new MediaWikiWrapper();
