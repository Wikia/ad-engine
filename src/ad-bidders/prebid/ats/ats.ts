import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'ATS';

class Ats {
	private isLoaded = false;
	private atsScriptSrc = 'https://ats.rlcdn.com/ats.js';

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'enabled');

		if (!this.isLoaded) {
			const userEmailHashes = context.get('wiki.opts.userEmailHashes');

			if (!userEmailHashes) {
				const performance = window.performance;
				const loadStart = performance.now();

				// tslint:disable-next-line:tsl-ban-snippets
				return utils.scriptLoader.loadScript(this.atsScriptSrc).then(() => {
					const loadEnd = performance.now();
					const loadTime = loadEnd - loadStart;

					(window as any).ats.start({
						placementID: '2161',
						emailHashes: userEmailHashes,
						storageType: 'localStorage',
						detectionType: 'scrape',
						logging: 'error',
					});

					this.dispatchAtsEvents(loadTime);
					this.isLoaded = true;
				});
			}

			return Promise.resolve();
		}
	}

	private isEnabled(): boolean {
		return (
			context.get('bidders.liveRampATS.enabled') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	private async dispatchAtsEvents(loadTime: number): Promise<void> {
		communicationService.dispatch(atsLoadedEvent({ loadTime }));

		(window as any).ats.retrieveEnvelope().then((atsEnvelope) => {
			const atsEnvelopeObj = JSON.parse(atsEnvelope);
			const envelope = atsEnvelopeObj.envelope || 'undefined';

			communicationService.dispatch(atsIdsLoadedEvent({ envelope }));
		});
	}
}

export const atsLoadedEvent = globalAction(
	'[AdEngine] ATS.js loaded',
	props<{ loadTime: number }>(),
);

export const atsIdsLoadedEvent = globalAction(
	'[AdEngine] ATS ids loaded',
	props<{ envelope: string }>(),
);

export const ats = new Ats();
