import { context, DiProcess } from '@wikia/ad-engine';

export class UcpNoAdsWikiContextSetup implements DiProcess {
	execute(): void {
		const platformName =
			window.ads.context && window.ads.context.opts.platformName
				? window.ads.context.opts.platformName
				: '';
		context.set('services.instantConfig.endpoint', 'https://services.fandom.com');
		context.set('services.instantConfig.appName', platformName);

		if (platformName === 'fandomdesktop') context.set('targeting.skin', 'ucp_desktop');
		else if (platformName === 'fandommobile') context.set('targeting.skin', 'ucp_mobile');
		else context.set('targeting.skin', 'no_ads');
	}
}
