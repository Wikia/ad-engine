import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { logger, queryString } from '@ad-engine/utils';

export class GamespotInfiniteScrollObserverSetup implements DiProcess {
	private NOT_REQUESTED_SLOT_WRAPPER_SELECTOR = '.mapped-ad > .ad-wrap:not(.gpt-ad)';
	private currentPage = 1;
	private loadedAds = {};

	execute(): void {
		const infiniteScrollElement = document.getElementById('js-infinite-scroll');

		if (!infiniteScrollElement) {
			logger('pageChangeWatcher', 'InfiniteScrollObserver - abortted');
			return;
		}

		const config = { subtree: true, childList: true };
		const observer = new MutationObserver(() => this.handleMutation());

		logger('pageChangeWatcher', 'InfiniteScrollObserver setting the observer');
		observer.observe(infiniteScrollElement, config);
	}

	private handleMutation() {
		logger(
			'pageChangeWatcher',
			'InfiniteScrollObserver detected mutation',
			this.currentPage,
			this.loadedAds,
			location.search,
		);

		const pageNumber = this.getPageFromSearchInLocation();

		if (this.currentPage === 1 && Object.keys(this.loadedAds).length === 0) {
			// the first slot to fill appears before ?page changes in the URL
			this.requestAdForUnfilledSlots();
		}

		if (this.currentPage !== pageNumber) {
			logger('pageChangeWatcher', 'page changed', pageNumber);
			this.currentPage = pageNumber;
			this.requestAdForUnfilledSlots();
		}
	}

	private requestAdForUnfilledSlots() {
		const adSlotsToFill = Object.values(
			document.querySelectorAll(this.NOT_REQUESTED_SLOT_WRAPPER_SELECTOR),
		).filter((adWrapper: Element) => {
			const placeholder = adWrapper.parentElement;

			if (!placeholder.classList.contains('gpt-ad')) {
				return adWrapper;
			}
		});
		logger('pageChangeWatcher', 'adSlotsToFill: ', adSlotsToFill);

		adSlotsToFill.forEach((adWrapper: Element) => {
			const placeholder = adWrapper.parentElement;
			const baseSlotName = placeholder?.getAttribute('data-ad-type');

			if (baseSlotName === 'interstitial') {
				return;
			}

			const slotName = this.calculateSeamlessSlotName(placeholder);
			logger('pageChangeWatcher', 'slot to copy: ', baseSlotName, slotName);

			placeholder.id = slotName;

			this.updateSlotContext(baseSlotName, slotName);
			context.push('state.adStack', { id: slotName });
		});
	}

	private getPageFromSearchInLocation(): number {
		const pageNumber = queryString.get('page') || '1';

		return parseInt(pageNumber, 10);
	}

	private calculateSeamlessSlotName(placeholder) {
		const baseSlotName = placeholder?.getAttribute('data-ad-type');
		this.loadedAds[baseSlotName] = !this.loadedAds[baseSlotName]
			? 1
			: this.loadedAds[baseSlotName] + 1;

		return `${baseSlotName}-${this.loadedAds[baseSlotName]}`;
	}

	private updateSlotContext(baseSlotName: string, slotName: string) {
		context.set(`slots.${slotName}`, { ...context.get(`slots.${baseSlotName}`) });
		context.set(`slots.${slotName}.slotName`, slotName);

		targetingService.set('pos', slotName, slotName);
		targetingService.set('pos_nr', targetingService.get('pos_nr', baseSlotName), slotName);

		logger(
			'pageChangeWatcher',
			'new slot config: ',
			context.get(`slots.${slotName}`),
			'based on: ',
			context.get(`slots.${baseSlotName}`),
		);
	}
}
