import { registerInterstitialTemplate } from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	DiProcess,
	eventsRepository,
	logTemplates,
	PorvataTemplate,
	SafeFanTakeoverElement,
	TemplateRegistry,
	templateService,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';
import { getOutstreamConfig } from './configs/outstream-config';
import { registerFloorAdhesionTemplate } from './floor-adhesion-template';
import { registerLogoReplacementTemplate } from './logo-replacement-template';
import { registerRoadblockTemplate } from './roadblock-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class UcpDesktopTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);
		const roadblock$ = registerRoadblockTemplate(this.registry);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const interstitial$ = registerInterstitialTemplate(this.registry);
		const logoReplacement$ = registerLogoReplacementTemplate(this.registry);

		logTemplates(
			merge(bfaa$, bfab$, stickyTlb$, roadblock$, floorAdhesion$, interstitial$, logoReplacement$),
		);

		templateService.register(PorvataTemplate, getOutstreamConfig());
		templateService.register(SafeFanTakeoverElement);

		communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () => {
			this.configureStickingCompanion();
		});
	}

	private configureStickingCompanion(): void {
		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				if (!this.registerStickingCompanionStickedListener()) {
					return;
				}

				this.registerStickingCompanionViewedListener();
			},
			'top_boxad',
			true,
		);
	}

	private registerStickingCompanionStickedListener(): boolean {
		const rightRailElement: HTMLElement = document.querySelector(
			'.right-rail-wrapper, .main-page-tag-rcs',
		);

		if (!rightRailElement) {
			return false;
		}

		communicationService.onSlotEvent(
			AdSlot.CUSTOM_EVENT,
			({ payload }) => {
				if (payload.status === universalAdPackage.SLOT_STICKED_STATE) {
					const tlbHeight = document.getElementById('top_leaderboard')?.offsetHeight || 36;
					rightRailElement.style.top = `${tlbHeight}px`;
					if (rightRailElement.className.includes('right-rail-wrapper')) {
						this.reduceRightRailWrapperHeight(rightRailElement);
					}
				}
			},
			'top_leaderboard',
		);

		return true;
	}

	private registerStickingCompanionViewedListener(): void {
		const pageElement = document.querySelector('.page');

		communicationService.onSlotEvent(
			AdSlot.SLOT_VIEWED_EVENT,
			() => {
				setTimeout(() => {
					pageElement.classList.remove('companion-stick');
					pageElement.classList.add('companion-done');
				}, 500);
			},
			'top_boxad',
			true,
		);

		pageElement.classList.add('companion-stick');
	}

	private reduceRightRailWrapperHeight(rightRailElement: HTMLElement) {
		const reducedHeight = this.getRightRailElementsTotalHeight(rightRailElement);
		if (reducedHeight > 0) {
			rightRailElement.style.height = `${reducedHeight}px`;
		}
	}

	private getRightRailElementsTotalHeight(rightRailElement: HTMLElement) {
		const rightRailCssSelector = `.${rightRailElement.className.replace(' ', '.')}`;
		const divsInsideRightRail: NodeListOf<HTMLElement> = document.querySelectorAll(
			`${rightRailCssSelector} > div`,
		);

		let totalHeight = 0;

		for (let i = 0; i < divsInsideRightRail.length; i++) {
			totalHeight += divsInsideRightRail[i].offsetHeight;
		}

		return totalHeight;
	}
}
