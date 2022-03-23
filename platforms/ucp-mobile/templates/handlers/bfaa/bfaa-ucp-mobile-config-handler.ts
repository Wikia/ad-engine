import { slotsContext } from '@platforms/shared';
import {
	context,
	slotService,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class BfaaUcpMobileConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = ['top_boxad', 'mobile_prefooter', 'bottom_leaderboard'];
		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(slotService.getAllowedSlots() || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);
		context.set('slots.incontent_boxad_1.repeat', null);

		slotsContext.setSlotSize(
			'bottom_leaderboard',
			universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile,
		);
	}
}
