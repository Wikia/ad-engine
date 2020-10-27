import { NoAdsDetector, slotsContext } from '@platforms/shared';
import {
	AdSlot,
	context,
	Dictionary,
	DiProcess,
	SlotConfig,
	slotInjector,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class HydraDynamicSlotsSetup implements DiProcess {
	constructor(private noAdsDetector: NoAdsDetector) {}

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
		this.injectMedrecs();
		this.injectBLB(slots['bottom_leaderboard'].insertAfterSelector);
		this.injectFooterAd();
	}

	private injectBLB(siblingsSelector): void {
		const wrapper = document.createElement('div');
		wrapper.id = 'btflb';

		const bottomLeaderboard = document.createElement('div');
		bottomLeaderboard.id = 'bottom_leaderboard';

		const dbName = context.get('wiki.targeting.wikiDbName');
		const siderail = document.getElementById(`siderail_${dbName}`);
		const siblingElement = siderail || document.querySelector(siblingsSelector);

		if (siblingElement) {
			siblingElement.parentNode.insertBefore(wrapper, siblingElement.nextSibling);
			wrapper.appendChild(bottomLeaderboard);
		}
	}

	private injectMedrecs(): void {
		const dbName = context.get('wiki.targeting.wikiDbName');
		const siderail = document.getElementById(`siderail_${dbName}`);

		if (siderail) {
			const topBoxadWrapper = document.createElement('div');
			const topBoxad = document.createElement('div');
			const incontentBoxadWrapper = document.createElement('div');
			const incontentBoxad = document.createElement('div');

			topBoxadWrapper.id = `atfmrec_${dbName}_gamepedia`;
			topBoxad.id = 'top_boxad';
			incontentBoxadWrapper.id = `btfmrec_${dbName}_gamepedia`;
			incontentBoxad.id = 'incontent_boxad_1';

			siderail.prepend(topBoxadWrapper);

			siderail.appendChild(incontentBoxadWrapper);
			topBoxadWrapper.appendChild(topBoxad);
			incontentBoxadWrapper.appendChild(incontentBoxad);
		}
	}

	private injectFooterAd(): void {
		if (this.noAdsDetector.isAdsMode()) {
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
