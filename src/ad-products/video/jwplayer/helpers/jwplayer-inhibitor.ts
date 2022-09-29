import { context, utils } from '@ad-engine/core';
import { universalAdPackage } from '../../../templates';

export class JWPlayerInhibitor {
	private logGroup = 'jwp-player-inhibitor';
	private videoLines: Array<string>;
	initialized: utils.ExtendedPromise<void>;

	private isEnabled(): boolean {
		if (!this.videoLines) {
			this.videoLines = context.get('options.video.uapJWPLineItemIds') || [];
		}

		return (
			context.get('custom.hasFeaturedVideo') &&
			context.get('options.video.isUAPJWPEnabled') &&
			this.videoLines.length > 0
		);
	}

	get(): Promise<void> {
		if (!this.isEnabled()) {
			return Promise.resolve();
		}

		return this.getExtendedPromise();
	}

	resolve(lineItemId: string | null = null, creativeId: string | null = null): void {
		if (!this.isEnabled()) {
			utils.logger(this.logGroup, 'isDisabled');
			return;
		}

		if (lineItemId && creativeId && this.videoLines.includes(lineItemId)) {
			universalAdPackage.updateSlotsTargeting(lineItemId, creativeId);
		}

		this.getExtendedPromise().resolve();
	}

	private getExtendedPromise(): utils.ExtendedPromise<void> {
		if (!this.initialized) {
			this.initialized = utils.createExtendedPromise();
		}

		return this.initialized;
	}
}

export const jwPlayerInhibitor = new JWPlayerInhibitor();
