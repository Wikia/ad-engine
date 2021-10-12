import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'nativo';
export const libraryUrl = 'https://s.ntv.io/serve/load.js';
export const nativoLoadedEvent = globalAction('[AdEngine] Nativo loaded', props<{}>());

class Nativo {
	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				this.sendEvent();
				utils.logger(logGroup, 'ready');
			});
	}

	private sendEvent(): void {
		communicationService.dispatch(nativoLoadedEvent({}));
	}

	private isEnabled(): boolean {
		return context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
	}
}
export const nativo = new Nativo();
