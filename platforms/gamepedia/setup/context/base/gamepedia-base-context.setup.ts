import { BaseContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaBaseContextSetup extends BaseContextSetup {
	configureBaseContext(isMobile = false): void {
		super.configureBaseContext(isMobile);
		this.disableAdsIfNoAdsPage();
	}

	private disableAdsIfNoAdsPage(): void {
		const pageName: string = context.get('wiki.wgPageName') || '';
		const pagesWithoutAds: string[] = window['wgAdDriverPagesWithoutAds'] || [];

		if (pagesWithoutAds.some((pageWithoutAds) => pageWithoutAds.includes(pageName))) {
			this.noAdsDetector.addReason('page_without_ads');
		}
	}
}
