// @ts-strict-ignore
import { context, DiProcess, targetingService, utils } from '@wikia/ad-engine';

export class GamespotSeamlessContentObserverSetup implements DiProcess {
	protected notRequestedSlotWrapperSelector = '.mapped-ad > .ad-wrap:not(.gpt-ad)';
	protected elementToObserveMutationSelector = 'title';
	protected dataAdAttribute = 'data-ad-type';
	protected useParentAsAdPlaceholder = true;

	private currentPath = '';
	private seamlessContentLoaded = {};
	private seamlessAdsAdded = {};

	execute(): void {
		// register first page after load
		this.currentPath = location.pathname;
		this.seamlessContentLoaded[location.pathname] = true;

		const elementToObserveMutation = document.querySelector(this.elementToObserveMutationSelector);
		if (!elementToObserveMutation) {
			return;
		}

		const config = { subtree: false, childList: true };
		const observer = new MutationObserver(() => this.handleMutation());
		observer.observe(elementToObserveMutation, config);
	}

	private handleMutation() {
		utils.logger(
			'pageChangeWatcher',
			'observer init',
			this.currentPath,
			location.pathname,
			this.seamlessContentLoaded,
		);

		if (this.currentPath !== location.pathname) {
			utils.logger('pageChangeWatcher', 'url changed', location.pathname);
			this.currentPath = location.pathname;

			if (this.seamlessContentLoaded[location.pathname]) {
				utils.logger(
					'pageChangeWatcher',
					'ads already loaded for this content',
					location.href,
					this.seamlessContentLoaded,
				);
				return;
			}

			this.seamlessContentLoaded[location.pathname] = true;
			this.requestAdForUnfilledSlots();
		}
	}

	private requestAdForUnfilledSlots() {
		const adSlotsToFill = document.querySelectorAll(this.notRequestedSlotWrapperSelector);
		utils.logger('pageChangeWatcher', 'adSlotsToFill: ', adSlotsToFill);
		adSlotsToFill.forEach((adWrapper: Element) => {
			const placeholder = this.useParentAsAdPlaceholder ? adWrapper.parentElement : adWrapper;
			const baseSlotName = placeholder?.getAttribute(this.dataAdAttribute);

			if (baseSlotName === 'interstitial') {
				return;
			}

			if (!this.isSlotDefinedInContext(baseSlotName)) {
				utils.logger(
					'pageChangeWatcher',
					'slot not defined in the context:',
					baseSlotName,
					placeholder,
					this.dataAdAttribute,
				);
				return;
			}

			const slotName = this.calculateSeamlessSlotName(baseSlotName);
			utils.logger('pageChangeWatcher', 'slot to copy: ', baseSlotName, slotName);

			placeholder.id = slotName;

			this.updateSlotContext(baseSlotName, slotName);
			context.push('state.adStack', { id: slotName });
		});
	}

	private calculateSeamlessSlotName(baseSlotName) {
		this.seamlessAdsAdded[baseSlotName] = !this.seamlessAdsAdded[baseSlotName]
			? 1
			: this.seamlessAdsAdded[baseSlotName] + 1;

		return `${baseSlotName}-${this.seamlessAdsAdded[baseSlotName]}`;
	}

	private updateSlotContext(baseSlotName: string, slotName: string) {
		context.set(`slots.${slotName}`, { ...context.get(`slots.${baseSlotName}`) });
		context.set(`slots.${slotName}.slotName`, slotName);

		targetingService.set('pos', slotName, slotName);
		targetingService.set('pos_nr', targetingService.get('pos_nr', baseSlotName), slotName);

		utils.logger(
			'pageChangeWatcher',
			'new slot config: ',
			context.get(`slots.${slotName}`),
			'based on: ',
			context.get(`slots.${baseSlotName}`),
		);
	}

	private isSlotDefinedInContext(slotName: string): boolean {
		return Object.keys(context.get('slots')).includes(slotName);
	}
}
