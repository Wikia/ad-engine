import { logger, scriptLoader } from '../utils';
import { context } from './context-service';

const logGroup = 'pbjs-factory';

window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];

class PbjsFactory {
	private instancePromise: Promise<Pbjs>;

	async init(): Promise<Pbjs> {
		if (!this.instancePromise) {
			const libraryUrl = context.get('bidders.prebid.libraryUrl');

			if (libraryUrl) {
				scriptLoader.loadScript(libraryUrl, 'text/javascript', true, 'first');
			} else {
				logger(
					logGroup,
					'Prebid library URL not defined. Assuming that window.pbjs will be loaded.',
				);
			}

			this.instancePromise = new Promise((resolve) =>
				window.pbjs.que.push(() => resolve(window.pbjs)),
			);
		}

		return this.instancePromise;
	}
}

export const pbjsFactory = new PbjsFactory();
