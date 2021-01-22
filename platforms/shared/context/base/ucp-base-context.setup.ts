import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { BaseContextSetup } from '../../setup/base-context.setup';

@Injectable()
export class UcpBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		if (
			window.ads.context.opts.noAdsReason &&
			!(
				window.ads.context.opts.noAdsReason === 'no_ads_user' &&
				window.ads.context.opts.pageType === 'homepage_logged'
			)
		) {
			this.noAdsDetector.addReason(window.ads.context.opts.noAdsReason);
		}

		context.set(
			'options.floatingMedrecDestroyable',
			this.instantConfig.get('icFloatingMedrecDestroyable'),
		);
		context.set(
			'options.jwplayerA9LoggerErrorCodes',
			this.instantConfig.get('icA9LoggerErrorCodes'),
		);
		context.set('options.tracking.tabId', this.instantConfig.get('icTabIdTracking'));
		// sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		context.set(
			'userId',
			(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		);
		context.set('options.video.watchingThat.enabled', this.instantConfig.get('icWatchingThat'));
	}
}
