import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class BfaaUcpDesktopConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = ['top_boxad', 'incontent_boxad_1', 'bottom_leaderboard'];

		if (this.params.newTakeoverConfig) {
			this.configureStickingCompanion();
		}

		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);

		context.set('slots.bottom_leaderboard.viewportConflicts', []);

		slotsContext.setSlotSize(
			'bottom_leaderboard',
			universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
		);
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
			},
			'top_boxad',
			true,
		);
	}
}
