import { context, utils } from '@ad-engine/core';
import { universalAdPackage } from '../../../templates';

export class JWPlayerInhibitor {
	private promise: utils.ExtendedPromise<void>;
	private videoLines: Array<string>;

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
			return;
		}

		if (lineItemId && creativeId && this.videoLines.includes(lineItemId)) {
			universalAdPackage.updateSlotsTargeting(lineItemId, creativeId);
			universalAdPackage.setType('jwuap');
		}

		this.getExtendedPromise().resolve();
	}

	private getExtendedPromise(): utils.ExtendedPromise<void> {
		if (!this.promise) {
			this.promise = utils.createExtendedPromise();
		}

		return this.promise;
	}
}

export const jwPlayerInhibitor = new JWPlayerInhibitor();
