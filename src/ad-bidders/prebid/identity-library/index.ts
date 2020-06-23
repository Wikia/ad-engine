import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';

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
				communicationService.dispatch(
					identityLibraryLoadedEvent({ loadTime: loadEnd - loadStart }),
				);
				utils.logger(logGroup, 'ready');
				this.isLoaded = true;
			});
		}
	}

	getUids(): string {
		const identityInfo = window.headertag.getIdentityInfo();

		return Object.entries(identityInfo)
			.map(
				([name, info]) => `${name}=${'uids' in info['data'] ? info['data']['uids'][0]['id'] : ''}`,
			)
			.join('|');
	}
}

export const identityLibrary = new IdentityLibrary();
export const identityLibraryLoadedEvent = globalAction(
	'[AdEngine] Identity library loaded',
	props<{ loadTime: number }>(),
);
