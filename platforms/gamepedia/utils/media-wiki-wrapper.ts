// RLQ may not exist as AdEngine is loading independently from Resource Loader
window.RLQ = window.RLQ || [];

class MediaWikiWrapper {
	ready: Promise<void>;

	constructor() {
		// AdEngine has to wait for Track extension
		/*
		 mw.loader.using is no longer available in MediaWiki 1.33
		 Remove once https://gitlab.com/hydrawiki/hydra/issues/5087 is finished.
		*/
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
