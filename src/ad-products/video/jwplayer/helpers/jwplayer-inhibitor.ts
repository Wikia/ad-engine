import { context, utils } from '@ad-engine/core';
import { universalAdPackage } from '../../../templates';

export class JWPlayerInhibitor {
	private logGroup = 'jwp-player-inhibitor';
	private videoLines: Array<string>;
	private maxDelayTimeoutInMs = 0;
	initialized: utils.ExtendedPromise<void> = utils.createExtendedPromise();

	private isEnabled(): boolean {
		if (!this.videoLines) {
			this.videoLines = context.get('options.video.uapJWPLineItemIds') || [];
		}

		if (!this.maxDelayTimeoutInMs) {
			this.maxDelayTimeoutInMs = context.get('options.jwpMaxDelayTimeout') || 0;
		}

		return (
			context.get('custom.hasFeaturedVideo') &&
			context.get('options.video.isUAPJWPEnabled') &&
			this.maxDelayTimeoutInMs > 0 &&
			this.videoLines.length > 0
		);
	}

	get(): Promise<void> {
		if (!this.isEnabled()) {
			this.initialized.resolve();
		}

		return this.initialized;
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

		this.initialized.resolve();
	}
}

export const jwPlayerInhibitor = new JWPlayerInhibitor();
