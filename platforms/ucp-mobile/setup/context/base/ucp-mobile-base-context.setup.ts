import { BaseContextSetup } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		if (
			context.get('wiki.opts.noAdsReason') &&
			!(
				context.get('wiki.opts.noAdsReason') === 'no_ads_user' &&
				context.get('wiki.opts.pageType') === 'homepage_logged'
			)
		) {
			this.noAdsDetector.addReason(window.ads.context.opts.noAdsReason);
		}

		if (utils.queryString.get('mobile-app') === 'true') {
			this.noAdsDetector.addReason('mobileapp_querystring');
		}

		context.set('options.tracking.tabId', this.instantConfig.get('icTabIdTracking'));
		// FIXME: sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		// context.set(
		// 	'userId',
		// 	(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		// );

		context.set('options.video.watchingThat.enabled', this.instantConfig.get('icWatchingThat'));
	}
}
