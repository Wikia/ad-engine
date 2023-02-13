import { AdSlot, TEMPLATE, TemplateDependency, UapParams, utils } from '@wikia/ad-engine';
import { from, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DependencyContainer, inject, injectable } from 'tsyringe';

@injectable()
export class StickinessTimeout {
	static provide(defaultTimeout: number): TemplateDependency {
		return {
			bind: StickinessTimeout,
			provider: (container: DependencyContainer) =>
				new StickinessTimeout(
					container.resolve(TEMPLATE.SLOT),
					container.resolve(TEMPLATE.PARAMS),
					defaultTimeout,
				),
		};
	}

	private fallbackTimeout: number;
	private shouldStickUntillSlotViewed: boolean;

	constructor(
		@inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@inject(TEMPLATE.PARAMS) params: UapParams,
		defaultTimeout: number,
	) {
		this.fallbackTimeout =
			params.stickyAdditionalTime !== undefined ? params.stickyAdditionalTime : defaultTimeout;
		this.shouldStickUntillSlotViewed = params.stickyUntilSlotViewed;
	}

	isViewedAndDelayed(): Observable<boolean> {
		const bootstrap$ = of(false);
		const completed$ = from(
			this.adSlot.loaded
				.then(() => (this.shouldStickUntillSlotViewed ? this.adSlot.viewed : Promise.resolve()))
				.then(() => utils.wait(this.fallbackTimeout)),
		).pipe(map(() => true));

		return merge(bootstrap$, completed$);
	}
}
