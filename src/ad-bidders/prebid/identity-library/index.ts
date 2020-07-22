import { communicationService, globalAction } from '@ad-engine/communication';
import { context, Dictionary, utils } from '@ad-engine/core';
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
				this.dispatchIdsLoadedEvent();
				utils.logger(logGroup, 'ready');
				this.isLoaded = true;
			});
		}
	}

	dispatchIdsLoadedEvent(): void {
		const identityInfo = window.headertag.getIdentityInfo();
		const hasPendingResponses = Object.values(identityInfo).some(
			(response) => response['responsePending'],
		);

		if (hasPendingResponses) {
			window.headertag.subscribeEvent('rti_partner_request_complete', false, () =>
				communicationService.dispatch(identityLibraryIdsLoadedEvent()),
			);
		} else {
			communicationService.dispatch(identityLibraryIdsLoadedEvent());
		}
	}

	getUids(): string {
		const identityInfo = window.headertag.getIdentityInfo();

		return Object.entries(identityInfo)
			.map(([name, info]) => this.extractProviderInfo(name, info))
			.join('|');
	}

	private extractProviderInfo(name: string, identityInfo: Dictionary<any>): string {
		const uids = 'uids' in identityInfo['data'] ? identityInfo['data']['uids'][0]['id'] : '';

		return `${name}=${uids};responsePending=${identityInfo['responsePending']}`;
	}
}

export const identityLibrary = new IdentityLibrary();
export const identityLibraryLoadedEvent = globalAction(
	'[AdEngine] Identity library loaded',
	props<{ loadTime: number }>(),
);
export const identityLibraryIdsLoadedEvent = globalAction('[AdEngine] Identity library ids loaded');
