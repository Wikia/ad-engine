// @ts-strict-ignore
import { TemplateStateHandler } from "../../../../../core/services/templates-registry/template-state-handler";
import { resolvedState } from "../../utils/resolved-state";
import { UapParams } from "../../utils/universal-ad-package";

import SlotPlaceholderRetriever from "../../utils/slot-placeholder-retriever";
import { once } from "../../../../../core/utils/flow-control";

export class BfaaBootstrapHandler implements TemplateStateHandler {
	private slotPlaceholderRetriever: SlotPlaceholderRetriever;
	constructor(
		private params: UapParams,
	) {
		this.slotPlaceholderRetriever = new SlotPlaceholderRetriever(this.params);
	}

	async onEnter(transitionCallback): Promise<void> {
		const slot = this.slotPlaceholderRetriever.get();
		// slot.setConfigProperty('showManually', true);
		slot.classList.add('expanded-slot');
		slot.classList.add('bfaa-template');
		slot.classList.add('slot-responsive');
		slot.classList.add('theme-hivi'); // Required by replay-overlay
		this.slotPlaceholderRetriever.getContainer().classList.add('iframe-container');

		await this.slotPlaceholderRetriever.onReady();
		await this.awaitVisibleDOM();

		if (resolvedState.isResolvedState(this.params)) {
			transitionCallback('sticky');
		} else {
			resolvedState.updateInformationAboutSeenDefaultStateAd();
			transitionCallback('impact');
		}
	}

	private async awaitVisibleDOM(): Promise<void> {
		if (document.hidden) {
			await once(window, 'visibilitychange');
		}
	}

	async onLeave(): Promise<void> {
		this.slotPlaceholderRetriever.get().classList.add('hidead');
		document.body.classList.add('has-uap');
	}

	async onDestroy(): Promise<void> {
		document.body.classList.remove('has-uap');
	}
}
