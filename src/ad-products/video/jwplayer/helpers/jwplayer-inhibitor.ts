import { BaseServiceSetup, context } from '@ad-engine/core';
import { universalAdPackage } from '../../../templates';

export class JWPlayerInhibitor extends BaseServiceSetup {
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

	async call(lineItemId: string | null = null, creativeId: string | null = null): Promise<void> {
		if (this.isEnabled()) {
			if (lineItemId && creativeId && this.videoLines.includes(lineItemId)) {
				universalAdPackage.updateSlotsTargeting(lineItemId, creativeId);
			}
		}
	}
}

export const jwPlayerInhibitor = new JWPlayerInhibitor();
