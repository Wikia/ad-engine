import { AdSlot, UapParams, universalAdPackage, utils } from '@wikia/ad-engine';
import { from, Observable } from 'rxjs';
import { isUndefined } from 'util';

export class BfaaDelayHelper {
	constructor(private params: UapParams, private adSlot: AdSlot) {}

	isViewedAndDelayed(): Observable<unknown> {
		const slotViewed: Promise<void> = this.adSlot.loaded.then(() => this.adSlot.viewed);

		return from(slotViewed.then(() => utils.wait(this.getAdditionalStickinessTime())));
	}

	private getAdditionalStickinessTime(): number {
		if (!isUndefined(this.params.stickyAdditionalTime)) {
			return this.params.stickyAdditionalTime;
		}

		return universalAdPackage.BFAA_UNSTICK_DELAY;
	}
}
