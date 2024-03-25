// @ts-strict-ignore
import { slotsContext } from '@platforms/shared';
import {
	communicationService,
	context,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { AD_ENGINE_UAP_DOM_CHANGED } from "../../../../../communication/events/events-ad-engine-uap";

@Injectable({ autobind: false })
export class BfaaSportsConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		if (context.get('application') === 'futhead' && context.get('state.isMobile')) {
			const header: HTMLElement = document.querySelector('.site-header .content-header .container');

			if (header) {
				communicationService.on(
					AD_ENGINE_UAP_DOM_CHANGED,
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
