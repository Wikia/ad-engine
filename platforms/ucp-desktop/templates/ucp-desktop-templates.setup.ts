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
				const pageElement = document.querySelector('.page');
				const rightRailElement = document.querySelectorAll(
					'.main-page-tag-rcs, #rail-boxad-wrapper',
				)[0] as HTMLElement;

				if (!pageElement || !rightRailElement) {
					return;
				}

				pageElement.classList.add('uap-companion-stick');

				this.registerStickingCompanionStickedListener(rightRailElement);
				this.registerStickingCompanionViewedListener(pageElement);
			},
			'top_boxad',
			true,
		);
	}

	private registerStickingCompanionStickedListener(rightRailElement: HTMLElement): void {
		communicationService.onSlotEvent(
			AdSlot.CUSTOM_EVENT,
			({ payload }) => {
				if (payload.status === universalAdPackage.SLOT_STICKED_STATE) {
					const tlbHeight = document.getElementById('top_leaderboard')?.offsetHeight || 36;
					rightRailElement.style.top = `${tlbHeight}px`;
				}
			},
			'top_leaderboard',
		);
	}

	private registerStickingCompanionViewedListener(pageElement: Element): void {
		communicationService.onSlotEvent(
			AdSlot.SLOT_VIEWED_EVENT,
			() => {
				setTimeout(() => {
					pageElement.classList.remove('uap-companion-stick');
				}, 500);
			},
			'top_boxad',
			true,
		);
	}
}
