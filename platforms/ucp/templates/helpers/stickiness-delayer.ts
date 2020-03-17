import { AdSlot, UapParams, universalAdPackage, utils } from '@wikia/ad-engine';
import { from, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isUndefined } from 'util';

export class StickinessDelayer {
	constructor(private params: UapParams, private adSlot: AdSlot) {}

	isViewedAndDelayed(): Observable<boolean> {
		const bootstrap$ = of(false);
		const completed$ = from(
			this.adSlot.loaded
				.then(() => this.adSlot.viewed)
				.then(() => utils.wait(this.getAdditionalStickinessTime())),
		).pipe(map(() => true));

		return merge(bootstrap$, completed$);
	}

	private getAdditionalStickinessTime(): number {
		if (!isUndefined(this.params.stickyAdditionalTime)) {
			return this.params.stickyAdditionalTime;
		}

		return universalAdPackage.BFAA_UNSTICK_DELAY;
	}
}
