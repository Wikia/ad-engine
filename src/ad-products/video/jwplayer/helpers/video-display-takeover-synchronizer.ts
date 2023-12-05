import { context, globalContextService, targetingService, utils } from '@ad-engine/core';
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
	private videoLines: Array<string>;
	private maxDelayTimeoutInMs = 0;
	private isUAPJWPEnabled: boolean = undefined;
	initialized: utils.ExtendedPromise<void> = utils.createExtendedPromise();

	private isEnabled(): boolean {
		if (!this.videoLines) {
			this.videoLines = context.get('options.video.uapJWPLineItemIds') || [];
		}

		if (!this.maxDelayTimeoutInMs) {
			this.maxDelayTimeoutInMs = context.get('options.jwpMaxDelayTimeout') || 0;
		}

		if (this.isUAPJWPEnabled === undefined) {
			this.isUAPJWPEnabled = this.checkIfUAPJWPEnabled();
		}

		return (
			context.get('custom.hasFeaturedVideo') &&
			!context.get('options.video.displayAndVideoAdsSyncSetupEnabled') &&
			this.isUAPJWPEnabled &&
			this.maxDelayTimeoutInMs > 0 &&
			this.videoLines.length > 0
		);
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

		return this.maxDelayTimeoutInMs;
	}

	resolve(lineItemId: string | null = null, creativeId: string | null = null): void {
		if (!this.isEnabled()) {
			utils.logger(this.logGroup, 'is disabled');
			return;
		}

		if (lineItemId && creativeId && this.videoLines.includes(lineItemId)) {
			universalAdPackage.updateSlotsTargeting(lineItemId, creativeId);
			utils.logger(this.logGroup, 'video ad is from UAP:JWP campaign - updating key-vals');
		} else {
			utils.logger(this.logGroup, 'video ad is not from UAP:JWP campaign');
		}

		this.initialized.resolve(null);
	}

	private checkIfUAPJWPEnabled() {
		const flag = context.get('options.video.syncWithDisplay');

		if (typeof flag === 'string') {
			return VideoDisplayTakeoverSynchronizer.hasBundleOrTag(flag);
		} else if (Array.isArray(flag)) {
			return flag.some((v) => VideoDisplayTakeoverSynchronizer.hasBundleOrTag(v));
		}
		return !!flag;
	}

	private static hasBundleOrTag(tagOrBundle: string): boolean {
		const tag = tagOrBundle.split('=');

		if (tag.length == 2) {
			const value = targetingService.get(tag[0]);

			return Array.isArray(value) ? value.includes(tag[1]) : value === tag[1];
		}
		return globalContextService.hasBundle(tagOrBundle);
	}
}

export const videoDisplayTakeoverSynchronizer = new VideoDisplayTakeoverSynchronizer();
