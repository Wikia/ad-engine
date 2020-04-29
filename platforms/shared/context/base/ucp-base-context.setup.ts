import { context, Dictionary } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { BaseContextSetup } from '../../setup/_base-context.setup';

@Injectable()
export class UcpBaseContextSetup extends BaseContextSetup {
	configureBaseContext(isMobile = false): void {
		super.configureBaseContext(isMobile);

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

		const stickySlotsLines: Dictionary = this.instantConfig.get('icStickySlotLineItemIds');
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
