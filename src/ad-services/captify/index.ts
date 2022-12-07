import { BaseServiceSetup, utils } from '@ad-engine/core';

const logGroup = 'captify';

class Captify extends BaseServiceSetup {
	PIXEL_URL = 'https://p.cpx.to/p/12974/px.js';

	async call(): Promise<void> {
		if (!this.isEnabled('services.captify.enabled')) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}
		window.captify_kw_query_12974 = '';
		const section = document.getElementsByTagName('script')[0];
		utils.scriptLoader.createScript(this.PIXEL_URL, 'text/javascript', false, section);

		return Promise.resolve();
	}
}

export const captify = new Captify();
