import { slotsContext } from '@platforms/shared';
import {
	communicationService,
	context,
	eventsRepository,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class BfaaSportsConfigHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		if (context.get('application') === 'futhead' && context.get('state.isMobile')) {
			const header: HTMLElement = document.querySelector('.site-header .content-header .container');

			if (header) {
				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_DOM_CHANGED,
					({ element, size }) => {
						if (element === 'placeholder') {
							header.style.paddingTop = size;
						}
					},
					false,
				);
			}
		}

		const enabledSlots: string[] = ['cdm-zone-02', 'cdm-zone-04'];
		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);
		context.set('slots.cdm-zone-04.viewportConflicts', []);

		slotsContext.setSlotSize(
			'cdm-zone-04',
			context.get('state.isMobile')
				? universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile
				: universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
		);
	}
}
