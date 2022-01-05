import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';

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
				if (context.get('state.isLogged')) {
					const reason = 'no email';
					communicationService.emit(eventsRepository.ATS_NOT_LOADED_LOGGED, { reason });
				}

				return Promise.resolve();
			}

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

				communicationService.emit(eventsRepository.ATS_JS_LOADED, { loadTime });
				this.registerAtsIdsLoadedHandler();
				this.isLoaded = true;
			});
		}
	}

	private isEnabled(): boolean {
		return (
			context.get('bidders.liveRampATS.enabled') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	private async registerAtsIdsLoadedHandler(): Promise<void> {
		(window as any).ats.retrieveEnvelope().then((atsEnvelope) => {
			const atsEnvelopeObj = atsEnvelope ? JSON.parse(atsEnvelope) : undefined;
			const envelope = atsEnvelopeObj ? atsEnvelopeObj.envelope : 'undefined';

			communicationService.emit(eventsRepository.ATS_IDS_LOADED, { envelope });
		});
	}
}

export const ats = new Ats();
