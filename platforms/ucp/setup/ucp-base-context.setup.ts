import { BaseContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

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
		// sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		context.set(
			'userId',
			(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		);
	}
}
