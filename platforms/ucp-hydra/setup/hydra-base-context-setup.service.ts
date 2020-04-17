import { BaseContextSetup } from '@platforms/shared';
import { context, Dictionary } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class HydraBaseContextSetup extends BaseContextSetup {
	configureBaseContext(isMobile = false): void {
		super.configureBaseContext(isMobile);

		context.set(
			'options.floatingMedrecDestroyable',
			this.instantConfig.get('icFloatingMedrecDestroyable'),
		);
		// sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		context.set(
			'userId',
			(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		);

		const stickySlotsLines: Dictionary<any> = this.instantConfig.get('icStickySlotLineItemIds');
		if (stickySlotsLines && stickySlotsLines.length) {
			context.set('templates.stickyTlb.lineItemIds', stickySlotsLines);

			if (this.instantConfig.get('icHiViLeaderboardUnstickTimeout')) {
				context.set('options.unstickHiViLeaderboardAfterTimeout', true);
				context.set(
					'options.unstickHiViLeaderboardTimeout',
					this.instantConfig.get('icHiViLeaderboardUnstickTimeout'),
				);
			}
		}
	}
}
