import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, TEMPLATE, TemplateStateHandler } from '@ad-engine/core';
import { slotsContext } from '@platforms/shared';
import { UapParams, universalAdPackage } from '@wikia/ad-products';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class BfaaUcpMobileConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = [
			'top_boxad',
			'mobile_prefooter',
			'bottom_leaderboard',
			'gallery_leaderboard',
		];

		if (this.params.newTakeoverConfig) {
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_NTC_LOADED);
			enabledSlots.push('floor_adhesion');
		}

		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);

		slotsContext.setSlotSize(
			'bottom_leaderboard',
			universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile,
		);
		slotsContext.addSlotSize(
			'bottom_leaderboard',
			universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.unified,
		);
	}
}
