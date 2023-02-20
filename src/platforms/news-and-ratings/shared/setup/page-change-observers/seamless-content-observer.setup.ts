import { context, DiProcess, utils } from '@wikia/ad-engine';

export class SeamlessContentObserverSetup implements DiProcess {
	private DEFAULT_REQUESTED_SLOT_WRAPPER_SELECTOR = '.mapped-ad > .ad-wrap:not(.gpt-ad)';
	private DEFAULT_ELEMENT_TO_OBSERVE_MUTATION_SELECTOR = 'title';
	private DEFAULT_DATA_AD_ATTRIBUTE = 'data-ad-type';
	private DEFAULT_USE_PARENT_AS_AD_PLACEHOLDER = true;

	private notRequestedSlotWrapperSelector: string;
	private dataAdAttribute: string;
	private useParentAsAdPlaceholder: boolean;

	private currentUrl = '';
	private seamlessContentLoaded = {};
	private seamlessAdsAdded = {};

	execute(): void {
		const config = { subtree: false, childList: true };
		// register first page after load
		this.currentUrl = location.href;
		this.seamlessContentLoaded[location.pathname] = true;

		this.notRequestedSlotWrapperSelector =
			context.get('services.seamlessContent.notRequestedSlotWrapperSelector') ||
			this.DEFAULT_REQUESTED_SLOT_WRAPPER_SELECTOR;
		this.dataAdAttribute =
			context.get('services.seamlessContent.dataAdAttribute') || this.DEFAULT_DATA_AD_ATTRIBUTE;
		this.useParentAsAdPlaceholder = context.get(
			'services.seamlessContent.useParentAsAdPlaceholder',
		);
		this.useParentAsAdPlaceholder =
			typeof this.useParentAsAdPlaceholder === 'boolean'
				? this.useParentAsAdPlaceholder
				: this.DEFAULT_USE_PARENT_AS_AD_PLACEHOLDER;

		const elementToObserveMutationSelector =
			context.get('services.seamlessContent.elementToObserveMutationSelector') ||
			this.DEFAULT_ELEMENT_TO_OBSERVE_MUTATION_SELECTOR;
		const elementToObserveMutation = document.querySelector(elementToObserveMutationSelector);
		if (!elementToObserveMutation) {
			return;
		}

		const observer = new MutationObserver(() => this.handleMutation());

		observer.observe(elementToObserveMutation, config);
	}

	private handleMutation() {
		utils.logger(
			'pageChangeWatcher',
			'observer init',
			this.currentUrl,
			location.pathname,
			this.seamlessContentLoaded,
		);

		if (!this.currentUrl) {
			this.currentUrl = location.href;
			return;
		}

		if (this.currentUrl !== location.href) {
			utils.logger('pageChangeWatcher', 'url changed', location.href);
			this.currentUrl = location.href;

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
		context.set(`slots.${slotName}.targeting.pos`, slotName);
		utils.logger('pageChangeWatcher', 'new slot config: ', context.get(`slots.${slotName}`));
	}

	private isSlotDefinedInContext(slotName: string): boolean {
		return Object.keys(context.get('slots')).includes(slotName);
	}
}
