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
		this.positionTB();
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertBeforeSelector) {
				slotInjector.inject(slotName, true);
			}
		});
		this.injectBLB(slots['bottom_leaderboard'].insertAfterSelector);
	}

	private injectBLB(siblingsSelector): void {
		const wrapper = document.createElement('div');
		wrapper.id = 'btflb';

		const blbContainer = document.createElement('div');
		blbContainer.id = 'bottom_leaderboard';

		const siblingElement =
			document.querySelector('#siderail_ucpinternalgptestproject43') ||
			document.querySelector(siblingsSelector);

		if (siblingElement) {
			siblingElement.parentNode.insertBefore(wrapper, siblingElement.nextSibling);
			wrapper.appendChild(blbContainer);
		}
	}

	private positionTB(): void {
		window.onscroll = () => {
			const topBoxad = document.getElementById('top_boxad');
			const sideRail = document.getElementById('siderail_ucpinternalgptestproject43');
			const footer = document.getElementById('footer');
			const footerPush = document.getElementById('footer-push');
			const scrollYTopThreshold = 270;
			const globalWrapper = document.getElementById('global-wrapper');
			const windowHeight = globalWrapper.offsetHeight;
			const scrollYBottomThreshold = windowHeight - footer.offsetHeight - footerPush.offsetHeight;

			if (window.scrollY >= scrollYTopThreshold && window.scrollY < scrollYBottomThreshold) {
				topBoxad.style.display = 'inline-block';
				topBoxad.style.top = '10px';
				topBoxad.style.position = 'fixed';
				topBoxad.style.right = '34px';
				const topBoxadHeight = topBoxad.offsetHeight || '250';
				const siderailTop = Number(topBoxadHeight) + 20;
				sideRail.style.top = `${siderailTop}px`;
			} else if (window.scrollY < scrollYTopThreshold) {
				topBoxad.style.position = 'relative';
				topBoxad.style.right = '10px';
			} else if (window.scrollY >= scrollYBottomThreshold) {
				topBoxad.style.position = 'relative';
			}
		};
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
