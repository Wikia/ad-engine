import { displayAndVideoAdsSyncContext } from '@ad-engine/core';
import { createExtendedPromise, ExtendedPromise, logger } from '@ad-engine/utils';
import { universalAdPackage } from '../../../templates';

/*
 * Supports Video and Display Takeover synchronisation by resolving a promise when either
 * a) Video Ad impression sets UAP line or not
 * b) timeout for delaying the waiting for Video ad impression expires
 *
 * It only applies on Video pages and selected wikis, e.g. those that will have a bundles=X tag,
 * where X value or list of values is configured in the icUAPJWPlayer ICBM variable.
 */
export class VideoDisplayTakeoverSynchronizer {
	private logGroup = 'video-display-takeover-sync';
	initialized: ExtendedPromise<void> = createExtendedPromise();

	private isEnabled(): boolean {
		return displayAndVideoAdsSyncContext.isSyncEnabled();
	}

	get(): Promise<void> {
		if (!this.isEnabled()) {
			this.initialized.resolve(null);
		}

		return this.initialized;
	}

	isRequiredToRun(): boolean {
		return this.isEnabled();
	}

	getDelayTimeoutInMs(): number {
		if (!this.isEnabled()) {
			return 0;
		}

		return displayAndVideoAdsSyncContext.getSyncTimeout();
	}

	resolve(lineItemId: string | null = null, creativeId: string | null = null): void {
		if (!this.isEnabled()) {
			logger(this.logGroup, 'is disabled');
			return;
		}

		if (
			lineItemId &&
			creativeId &&
			displayAndVideoAdsSyncContext.getVideoSyncedWithDisplayLines().includes(lineItemId)
		) {
			universalAdPackage.updateSlotsTargeting(lineItemId, creativeId);
			logger(this.logGroup, 'video ad is from UAP:JWP campaign - updating key-vals');
		} else {
			logger(this.logGroup, 'video ad is not from UAP:JWP campaign');
		}

		this.initialized.resolve(null);
	}
}

export const videoDisplayTakeoverSynchronizer = new VideoDisplayTakeoverSynchronizer();
