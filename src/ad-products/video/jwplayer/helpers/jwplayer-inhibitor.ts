import { context, utils } from '@ad-engine/core';
import { universalAdPackage } from '../../../templates';

export class JWPlayerInhibitor {
	private promise: utils.ExtendedPromise<void>;

	private isEnabled(): boolean {
		return context.get('custom.hasFeaturedVideo') && context.get('options.video.isUAPJWPEnabled');
	}

	get(): Promise<void> {
		if (!this.isEnabled()) {
			return Promise.resolve();
		}

		return this.getExtendedPromise();
	}

	resolve(lineItemId: string = null, creativeId: string = null): void {
		if (!this.isEnabled()) {
			return;
		}

		if (lineItemId && creativeId) {
			universalAdPackage.updateSlotsTargeting(lineItemId, creativeId);
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
