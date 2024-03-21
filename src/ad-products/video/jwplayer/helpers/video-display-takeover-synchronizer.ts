import { displayAndVideoAdsSyncContext, utils } from '@ad-engine/core';

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
	initialized: utils.ExtendedPromise<void> = utils.createExtendedPromise();

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

	// Removing the lineItemId and creativeId, since we don't want to block additional slots
	// for UAP for this experiment. We want to make sure indirect ads can make it to these slots.
	// For the purpose of this experiment, removing the blocking logic should be enough without
	// risking video breaking as a whole for the numerous cases where this function gets called.
	resolve(): void {
		utils.logger(this.logGroup, 'Inside resolve.');

		if (!this.isEnabled()) {
			utils.logger(this.logGroup, 'is disabled');
			return;
		}

		// Slot resolution has been deleted,
		// since direct ads won't be run for the strip down of the indirect package.
		utils.logger(this.logGroup, 'video ad is not from UAP:JWP campaign.');

		this.initialized.resolve(null);
	}
}

export const videoDisplayTakeoverSynchronizer = new VideoDisplayTakeoverSynchronizer();
