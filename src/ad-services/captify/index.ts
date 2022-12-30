import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, utils } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class Captify extends BaseServiceSetup {
	PIXEL_URL = 'https://p.cpx.to/p/12974/px.js';
	LOG_GROUP = 'captify';

	async call(): Promise<void> {
		if (!this.isEnabled('services.captify.enabled')) {
			utils.logger(this.LOG_GROUP, 'disabled');

			return Promise.resolve();
		}

		window.captify_kw_query_12974 = '';
		const section = document.getElementsByTagName('script')[0];
		const elem = utils.scriptLoader.createScript(this.PIXEL_URL, 'text/javascript', true, section);

		elem.onload = () => {
			communicationService.emit(eventsRepository.CAPTIFY_LOADED);
		};

		return Promise.resolve();
	}
}
