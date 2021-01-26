import { context, DiProcess } from '@wikia/ad-engine';

export class UcpNoAdsWikiContextSetup implements DiProcess {
	execute(): void {
		const platformName =
			window.ads.context && window.ads.context.opts.platformName
				? window.ads.context.opts.platformName
				: '';
		const endpoint = `https://services.wikia.com/icbm/api/config?app=${platformName}`;

		context.set('services.instantConfig.endpoint', endpoint);
	}
}
