import { DynamicSlotsSetup, slotsContext } from '@platforms/shared';
import {
	AdSlot,
	context,
	Dictionary,
	SlotConfig,
	slotInjector,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
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

		const hiviLBEnabled = context.get('options.hiviLeaderboard');

		if (hiviLBEnabled) {
			context.set('slots.top_leaderboard.firstCall', false);

			slotService.on('hivi_leaderboard', AdSlot.STATUS_SUCCESS, () => {
				slotService.setState('top_leaderboard', false);
			});

			slotService.on('hivi_leaderboard', AdSlot.STATUS_COLLAPSE, () => {
				const adSlot = slotService.get('hivi_leaderboard');

				if (!adSlot.isEmpty) {
					slotService.setState('top_leaderboard', false);
				}
			});
		}

		if (!context.get('custom.hasFeaturedVideo')) {
			if (context.get('templates.stickyTlb.lineItemIds')) {
				context.set('templates.stickyTlb.enabled', true);
				context.push(
					`slots.${hiviLBEnabled ? 'hivi_leaderboard' : 'top_leaderboard'}.defaultTemplates`,
					'stickyTlb',
				);
			}
		}
	}
}
