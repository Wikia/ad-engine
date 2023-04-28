import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { insertSlots, SlotSetupDefinition } from '../../../../shared';

@Injectable()
export class NewsAndRatingsDynamicSlotsSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		this.injectSlots();

		insertSlots([this.getInterstitialConfig()]);
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.mapped-ad,.ad');

		if (!adPlaceholders || adPlaceholders.length === 0) {
			console.warn('AdEngine did not find any ad placeholders');
			return;
		}

		adPlaceholders.forEach((placeholder: Element) => {
			const adSlotName = placeholder.getAttribute('data-ad-type');
			const adWrapper = utils.Document.getFirstElementChild(placeholder);

			if (!adWrapper) {
				return;
			}

			adWrapper.id = adSlotName;

			if (this.isSlotLazyLoaded(adSlotName)) {
				context.push('events.pushOnScroll.ids', adSlotName);
			} else {
				context.push('state.adStack', { id: adSlotName });
			}
		});
	}

	private isSlotLazyLoaded(slotName: string): boolean {
		return context.get(`slots.${slotName}.lazyLoad`);
	}

	private getInterstitialConfig(): SlotSetupDefinition {
		if (!this.isInterstitialApplicable()) {
			return;
		}

		const slotName = 'interstitial';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: 'body',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isInterstitialApplicable(): boolean {
		return this.instantConfig.get('icInterstitial') && context.get('state.isMobile');
	}
}
