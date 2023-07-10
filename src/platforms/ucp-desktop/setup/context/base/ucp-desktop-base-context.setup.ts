import { BaseContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
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
	}
}
