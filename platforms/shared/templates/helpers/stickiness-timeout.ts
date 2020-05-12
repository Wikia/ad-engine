import { AdSlot, TEMPLATE, TemplateDependency, UapParams, utils } from '@wikia/ad-engine';
import { Container, Inject, Injectable } from '@wikia/dependency-injection';
import { from, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isUndefined } from 'util';

@Injectable({ autobind: false })
export class StickinessTimeout {
	static provide(defaultTimeout: number): TemplateDependency {
		return {
			bind: StickinessTimeout,
			provider: (container: Container) =>
				new StickinessTimeout(
					container.get(TEMPLATE.SLOT),
					container.get(TEMPLATE.PARAMS),
					defaultTimeout,
				),
		};
	}

	private fallbackTimeout: number;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) params: UapParams,
		defaultTimeout: number,
	) {
		this.fallbackTimeout = !isUndefined(params.stickyAdditionalTime)
			? params.stickyAdditionalTime
			: defaultTimeout;
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
