import { BaseContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		const isGamepedia = window.ads.context.opts.isGamepedia;
		const isLoggedIn = window.mw.config.get('wgUserId');

		if (isGamepedia && isLoggedIn) {
			this.noAdsDetector.addReason('gamepedia_loggedin_desktop_no_ads');
		}

		context.set(
			'options.floatingMedrecDestroyable',
			this.instantConfig.get('icFloatingMedrecDestroyable'),
		);
		// sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		context.set(
			'options.userId',
			(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		);
	}
}
