import { BaseContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		context.set(
			'options.floatingMedrecDestroyable',
			this.instantConfig.get('icFloatingMedrecDestroyable'),
		);
		// sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		context.set(
			'options.userId',
			(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		);
		context.set(
			'events.pushOnScroll.nativoThreshold',
			this.instantConfig.get('icPushOnScrollNativoThreshold', 200),
		);
	}
}
