import { AdSlot, TEMPLATE, UapParams, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isUndefined } from 'util';

export const STICKINESS_TIMEOUT_DEFAULT = Symbol('stickiness default timeout');

@Injectable({ autobind: false })
export class StickinessTimeout {
	private fallbackTimeout: number;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) params: UapParams,
		@Inject(STICKINESS_TIMEOUT_DEFAULT) fallbackTimeout: number,
	) {
		this.fallbackTimeout = !isUndefined(params.stickyAdditionalTime)
			? params.stickyAdditionalTime
			: fallbackTimeout;
	}

	isViewedAndDelayed(): Observable<boolean> {
		const bootstrap$ = of(false);
		const completed$ = from(
			this.adSlot.loaded
				.then(() => this.adSlot.viewed)
				.then(() => utils.wait(this.fallbackTimeout)),
		).pipe(map(() => true));

		return merge(bootstrap$, completed$);
	}
}
