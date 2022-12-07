import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'captify';

class Captify extends BaseServiceSetup {
	isEnabled(): boolean {
		return (
			context.get('services.captify.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}
		window.captify_kw_query_12974 = '';
		const elem = document.createElement('script');
		const section = document.getElementsByTagName('script')[0];
		elem.type = 'text/javascript';
		elem.async = !0;
		elem.src = 'https://p.cpx.to/p/12974/px.js';
		section.parentNode.insertBefore(elem, section);

		return Promise.resolve();
	}
}

export const captify = new Captify();
