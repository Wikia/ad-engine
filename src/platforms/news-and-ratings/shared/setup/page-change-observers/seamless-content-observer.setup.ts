import { context, DiProcess, utils } from '@wikia/ad-engine';

export class SeamlessContentObserverSetup implements DiProcess {
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

			// TODO: we should do below on "page loaded" event for the lazy-loaded seamless content
			const adSlotsToFill = document.querySelectorAll('.mapped-ad > .ad-wrap:not(.gpt-ad)');
			utils.logger('pageChangeWatcher', 'adSlotsToFill: ', adSlotsToFill);
			adSlotsToFill.forEach((adWrapper: Element) => {
				const placeholder = adWrapper.parentElement;
				const baseSlotName = placeholder?.getAttribute('data-ad-type');
				const slotName = this.calculateSeamlessSlotName(placeholder);
				utils.logger('pageChangeWatcher', 'slot to copy: ', baseSlotName, slotName);

				placeholder.id = slotName;

				this.updateSlotContext(baseSlotName, slotName);
				context.push('state.adStack', { id: slotName });
			});
		}
	}

	private calculateSeamlessSlotName(placeholder) {
		const baseSlotName = placeholder?.getAttribute('data-ad-type');
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
