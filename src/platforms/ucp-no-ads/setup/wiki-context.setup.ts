import { context, DiProcess } from '@wikia/ad-engine';

export class UcpNoAdsWikiContextSetup implements DiProcess {
	execute(): void {
		const platformName =
			window.ads.context && window.ads.context.opts.platformName
				? window.ads.context.opts.platformName
				: '';
		context.set('services.instantConfig.endpoint', 'https://services.fandom.com');
		context.set('services.instantConfig.appName', platformName);
	}
}
