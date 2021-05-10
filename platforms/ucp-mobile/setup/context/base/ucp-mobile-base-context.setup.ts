import { BaseContextSetup } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		context.set(
			'custom.serverPrefix',
			utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm1b' : 'wka1b',
		);

		context.set('options.tracking.tabId', this.instantConfig.get('icTabIdTracking'));
		// FIXME: sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		// context.set(
		// 	'userId',
		// 	(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		// );

		context.set('options.video.watchingThat.enabled', this.instantConfig.get('icWatchingThat'));
		context.set('events.pushOnScroll.threshold', this.instantConfig.get('icPushOnScrollThreshold'));

		if (context.get('wiki.opts.enableICLazyRequesting')) {
			context.set('wiki.opts.enableICBPlaceholder', false);
			context.set('wiki.opts.enableICPPlaceholder', false);
			context.set('events.pushAfterRendered.top_boxad', ['incontent_player', 'affiliate_slot']);
		}
	}
}
