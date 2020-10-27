import { BaseContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();
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
