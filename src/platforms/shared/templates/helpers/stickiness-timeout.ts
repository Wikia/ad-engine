import { AdSlot, TEMPLATE, TemplateDependency } from '@ad-engine/core';
import { wait } from '@ad-engine/utils';
import { type UapParams } from '@wikia/ad-products';
import { Container, Inject, Injectable } from '@wikia/dependency-injection';
import { from, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
		this.fallbackTimeout = defaultTimeout;
	}

	isViewedAndDelayed(): Observable<boolean> {
		const bootstrap$ = of(false);
		const completed$ = from(this.adSlot.loaded.then(() => wait(this.fallbackTimeout))).pipe(
			map(() => true),
		);

		return merge(bootstrap$, completed$);
	}
}
