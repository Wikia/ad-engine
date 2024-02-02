import { targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

export class UcpNoAdsWikiContextSetup implements DiProcess {
	execute(): void {
		const platformName =
			window.ads.context && window.ads.context.opts.platformName
				? window.ads.context.opts.platformName
				: '';

		if (platformName === 'fandomdesktop') targetingService.set('skin', 'ucp_desktop');
		else if (platformName === 'fandommobile') targetingService.set('skin', 'ucp_mobile');
		else targetingService.set('skin', 'no_ads');
	}
}
