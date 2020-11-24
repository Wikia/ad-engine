import { slotsContext } from '@platforms/shared';
import { context, Dictionary, DiProcess, SlotConfig, slotInjector } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboard();
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertBeforeSelector) {
				slotInjector.inject(slotName, true);
			}
		});
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertAfterSelector) {
				this.injectAfter(slotName, slots[slotName].insertAfterSelector);
			}
		});
	}

	private injectAfter(slotName, siblingsSelector): void {
		const container = document.createElement('div');
		const siblingElement = document.querySelector(siblingsSelector);

		container.id = slotName;

		if (siblingElement) {
			siblingElement.parentNode.insertBefore(container, siblingElement.nextSibling);
		}
	}

	private configureTopLeaderboard(): void {
		slotsContext.addSlotSize('top_leaderboard', [2, 2]);

		if (!context.get('custom.hasFeaturedVideo')) {
			if (context.get('templates.stickyTlb.lineItemIds')) {
				context.set('templates.stickyTlb.enabled', true);
				context.push('slots.top_leaderboard.defaultTemplates', 'stickyTlb');
			}
		}
	}
}
