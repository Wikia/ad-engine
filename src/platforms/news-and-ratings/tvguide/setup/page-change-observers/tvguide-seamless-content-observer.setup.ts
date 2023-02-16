import { context, DiProcess, utils } from '@wikia/ad-engine';

export class TvGuideSeamlessContentObserverSetup implements DiProcess {
	private NOT_REQUESTED_SLOT_WRAPPER_SELECTOR =
		'.c-adDisplay_container > .c-adDisplay:not(.gpt-ad)';
	private currentUrl = '';
	private seamlessContentLoaded = {};
	private seamlessAdsAdded = {};

	execute(): void {
		const config = { subtree: true, childList: true };
		// register first page after load
		this.currentUrl = location.href;
		this.seamlessContentLoaded[location.pathname] = true;

		const observer = new MutationObserver(() => this.handleMutation());

		observer.observe(document.querySelector('title'), config);
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
		const adSlotsToFill = document.querySelectorAll(this.NOT_REQUESTED_SLOT_WRAPPER_SELECTOR);
		utils.logger('pageChangeWatcher', 'adSlotsToFill: ', adSlotsToFill);
		adSlotsToFill.forEach((adWrapper: Element) => {
			const baseSlotName = adWrapper?.getAttribute('data-ad');
			const slotName = this.calculateSeamlessSlotName(baseSlotName);
			utils.logger('pageChangeWatcher', 'slot to copy: ', baseSlotName, slotName);

			adWrapper.id = slotName;

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
}
