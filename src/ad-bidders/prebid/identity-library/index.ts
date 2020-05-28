import { context, eventService, utils } from '@ad-engine/core';
import { action, props } from 'ts-action';

const logGroup = 'identity-library';
const scriptUrl = '//js-sec.indexww.com/ht/p/183085-19173550049191.js';

class IdentityLibrary {
	private isLoaded = false;

	private isEnabled(): boolean {
		return (
			context.get('bidders.ixIdentityLibrary.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		if (!this.isLoaded) {
			const performance = window.performance;
			const loadStart = performance.now();

			utils.logger(logGroup, 'loading');
			return utils.scriptLoader.loadScript(scriptUrl).then(() => {
				const loadEnd = performance.now();
				eventService.communicator.dispatch(
					identityLibraryLoadedEvent({ loadTime: loadEnd - loadStart }),
				);
				utils.logger(logGroup, 'ready');
				this.isLoaded = true;
			});
		}
	}
}

export const identityLibrary = new IdentityLibrary();
export const identityLibraryLoadedEvent = action(
	'[AdEngine] Identity library loaded',
	props<{ loadTime: number }>(),
);
