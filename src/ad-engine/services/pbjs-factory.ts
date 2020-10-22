import { logger, scriptLoader } from '../utils';
import { context } from './context-service';

const prebidLibraryUrl =
	'//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/v3.27.1/20201020.min.js';
const logGroup = 'pbjs-factory';

(window as any).pbjs = (window as any).pbjs || {};
(window as any).pbjs.que = (window as any).pbjs.que || [];

class PbjsFactory {
	private instancePromise: Promise<Pbjs>;

	init(): Promise<Pbjs> {
		if (!this.instancePromise) {
			const libraryUrl = context.get('bidders.prebid.libraryUrl');

			scriptLoader.loadScript(libraryUrl || prebidLibraryUrl, 'text/javascript', true, 'first');

			this.instancePromise = new Promise((resolve) =>
				(window as any).pbjs.que.push(() => {
					logger(logGroup, 'Prebid library loaded');

					resolve((window as any).pbjs);
				}),
			);
		}

		return this.instancePromise;
	}
}

export const pbjsFactory = new PbjsFactory();
