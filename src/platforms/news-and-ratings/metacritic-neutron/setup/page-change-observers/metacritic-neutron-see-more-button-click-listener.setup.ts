import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { logger, WaitFor } from '@ad-engine/utils';

export class MetacriticNeutronSeeMoreButtonClickListenerSetup implements DiProcess {
	private notRequestedSlotWrapperSelector = '.c-adDisplay_container > .c-adDisplay:not(.gpt-ad)';
	private dataAdAttribute = 'data-ad';
	private useParentAsAdPlaceholder = false;

	private seamlessAdsAdded = {};

	execute(): void {
		const seeMoreButton = document.querySelector('.c-pageArticleListings_seeMore');

		if (!seeMoreButton) {
			return;
		}

		seeMoreButton.addEventListener('click', () => {
			new WaitFor(
				() => document.querySelectorAll(this.notRequestedSlotWrapperSelector)?.length > 0,
				10,
				50,
			)
				.until()
				.then(() => this.requestAdForUnfilledSlots());
		});
	}

	private requestAdForUnfilledSlots() {
		const adSlotsToFill = document.querySelectorAll(this.notRequestedSlotWrapperSelector);
		logger('pageChangeWatcher', 'adSlotsToFill: ', adSlotsToFill);
		adSlotsToFill.forEach((adWrapper: Element) => {
			const placeholder = this.useParentAsAdPlaceholder ? adWrapper.parentElement : adWrapper;
			const baseSlotName = placeholder?.getAttribute(this.dataAdAttribute);

			if (!this.isSlotDefinedInContext(baseSlotName)) {
				logger(
					'pageChangeWatcher',
					'slot not defined in the context:',
					baseSlotName,
					placeholder,
					this.dataAdAttribute,
				);
				return;
			}

			const slotName = this.calculateSeamlessSlotName(baseSlotName);
			logger('pageChangeWatcher', 'slot to copy: ', baseSlotName, slotName);

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

		logger(
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
