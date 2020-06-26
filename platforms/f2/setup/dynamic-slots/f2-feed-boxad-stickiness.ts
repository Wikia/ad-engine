import { DomListener, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class F2FeedBoxadStickiness {
	private subscription?: Subscription;

	constructor(private listener: DomListener) {}

	initializeFeedBoxadStickiness(): Subscription {
		if (this.subscription?.closed === false) {
			return this.subscription;
		}

		const boxad: HTMLElement = document.querySelector('.feed-bottom-boxad');
		const rail: HTMLElement = document.querySelector('.feed-layout__right-rail');
		const stickyClass = 'is-sticky';
		const bottomClass = 'is-bottom';

		this.subscription = this.listener.scroll$
			.pipe(
				tap(() => {
					if (this.isAboveSticky()) {
						boxad.classList.remove(stickyClass);
						boxad.classList.remove(bottomClass);
					} else if (this.isBelowSticky(utils.getHeight(boxad), rail)) {
						boxad.classList.add(bottomClass);
						boxad.classList.add(stickyClass);
					} else {
						boxad.classList.remove(bottomClass);
						boxad.classList.add(stickyClass);
					}
				}),
			)
			.subscribe();

		return this.subscription;
	}

	private isAboveSticky(): boolean {
		const windowTop = window.scrollY + 56; // nav height
		const lowerMain: HTMLElement = document.querySelector('.feed-item[data-feed-index="10"]');

		return windowTop < utils.getTopOffset(lowerMain);
	}

	private isBelowSticky(boxadHeight: number, rail: HTMLElement): boolean {
		const windowTop = window.scrollY;
		const railOffsetTop = utils.getTopOffset(rail);
		const railHeight = utils.getHeight(rail);
		const feedRailBottom = railOffsetTop + railHeight;

		return windowTop + boxadHeight > feedRailBottom;
	}
}
