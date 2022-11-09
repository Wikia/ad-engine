import { context, DiProcess } from '@wikia/ad-engine';

import { basicContext } from '../ad-context';

export class PlayerOneContextSetup implements DiProcess {
	execute(): void {
		context.extend(basicContext);

		this.setupSitePartForAdUnit();
		this.setupPageTypeForAdUnit();
	}

	private setupSitePartForAdUnit() {
		switch (location.host) {
			case 'metacritic.com':
			case 'www.metacritic.com':
				context.set('custom.site', 'metacritic');
				break;

			case 'gamefaqs.gamespot.com':
			case 'www.gamefaqs.gamespot.com':
				context.set('custom.site', 'gamefaqs');
				break;
		}
	}

	private setupPageTypeForAdUnit() {
		switch (location.pathname) {
			case '/':
				context.set('custom.pageType', 'home');
				break;
			default:
				context.set('custom.pageType', '');
		}
	}
}
