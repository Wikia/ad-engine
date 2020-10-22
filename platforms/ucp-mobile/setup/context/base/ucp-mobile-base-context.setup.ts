import { BaseContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		if (context.get('wiki.opts.noAdsReason')) {
			this.noAdsDetector.addReason(context.get('wiki.opts.noAdsReason'));
		}
		if (
			context.get('wiki.opts.noAdsReason') === 'no_ads_user' &&
			context.get('wiki.opts.pageType') === 'homepage_logged'
		) {
			this.noAdsDetector.addReason('');
		}

		context.set('options.tracking.tabId', this.instantConfig.get('icTabIdTracking'));
		// FIXME: sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		// context.set(
		// 	'userId',
		// 	(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		// );
	}
}
