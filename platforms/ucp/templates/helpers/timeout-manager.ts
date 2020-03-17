import { AdSlot, TEMPLATE, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isUndefined } from 'util';

interface TimeoutManagerParams {
	stickyAdditionalTime?: number;
}

@Injectable()
export class TimeoutManager {
	private state$ = new BehaviorSubject(false);
	resolved$ = this.state$.asObservable().pipe(filter((value) => value));

	get resolved(): boolean {
		return this.state$.value;
	}

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: TimeoutManagerParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
	) {}

	start(fallbackTimeout: number): void {
		this.state$.next(false);

		this.adSlot.loaded
			.then(() => this.adSlot.viewed)
			.then(() => utils.wait(this.getAdditionalStickinessTime(fallbackTimeout)))
			.then(() => this.state$.next(true));
	}

	private getAdditionalStickinessTime(fallbackTimeout: number): number {
		if (!isUndefined(this.params.stickyAdditionalTime)) {
			return this.params.stickyAdditionalTime;
		}

		return fallbackTimeout;
	}
}
