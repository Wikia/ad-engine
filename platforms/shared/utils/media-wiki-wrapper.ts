// RLQ may not exist as AdEngine is loading independently from Resource Loader
window.RLQ = window.RLQ || [];

class MediaWikiWrapper {
	ready: Promise<void>;

	constructor() {
		this.ready = new Promise<void>((resolve) =>
			window.RLQ.push(() => {
				window.mw.loader.enqueue(['ext.track.scripts'], resolve);
			}),
		);
	}
}

export const mediaWikiWrapper = new MediaWikiWrapper();
