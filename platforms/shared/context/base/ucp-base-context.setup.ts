import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { BaseContextSetup } from '../../setup/base-context.setup';

@Injectable()
export class UcpBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

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
	}
}
