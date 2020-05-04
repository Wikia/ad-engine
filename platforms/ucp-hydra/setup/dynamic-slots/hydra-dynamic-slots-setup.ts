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
export class HydraDynamicSlotsSetup implements DynamicSlotsSetup {
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
		this.injectTB();
		this.injectBLB(slots['bottom_leaderboard'].insertAfterSelector);
		this.injectFooterAd();
	}

	private injectBLB(siblingsSelector): void {
		const wrapper = document.createElement('div');
		wrapper.id = 'btflb';

		const blbContainer = document.createElement('div');
		blbContainer.id = 'bottom_leaderboard';

		const dbName = context.get('wiki.targeting.wikiDbName');
		const siderail = document.getElementById(`siderail_${dbName}`);
		const siblingElement = siderail || document.querySelector(siblingsSelector);

		if (siblingElement) {
			siblingElement.parentNode.insertBefore(wrapper, siblingElement.nextSibling);
			wrapper.appendChild(blbContainer);
		}
	}

	private injectTB(): void {
		const dbName = context.get('wiki.targeting.wikiDbName');
		const siderail = document.getElementById(`siderail_${dbName}`);

		if (siderail) {
			const topBoxad = document.createElement('div');

			topBoxad.id = 'top_boxad';
			siderail.appendChild(topBoxad);
		}
	}

	private injectFooterAd(): void {
		if (context.get('state.showAds')) {
			const footer = document.getElementById('curse-footer');
			const footerWrapper = footer.querySelector('.footer-wrapper');
			const footerBoxadContainer = document.createElement('div');
			const footerBoxad = document.createElement('div');

			footerBoxad.id = 'footer_boxad';
			footerBoxadContainer.appendChild(footerBoxad);

			footerBoxadContainer.classList.add('footer-box', 'footer-ad');
			footerWrapper.appendChild(footerBoxadContainer);

			footer.classList.remove('hide-ads');
		}
	}

	private configureTopLeaderboard(): void {
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
			slotsContext.addSlotSize(hiviLBEnabled ? 'hivi_leaderboard' : 'top_leaderboard', [3, 3]);

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
