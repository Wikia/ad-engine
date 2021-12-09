import { slotsContext } from '@platforms/shared';
import {
	context,
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
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);
		context.set('slots.incontent_boxad_1.repeat', null);

		const additionalSizes = universalAdPackage.UAP_ADDITIONAL_SIZES.mobile;

		slotsContext.addSlotSize('top_boxad', additionalSizes.companionSize);
		slotsContext.addSlotSize('mobile_prefooter', additionalSizes.companionSize);
		slotsContext.setSlotSize('bottom_leaderboard', additionalSizes.bfaSize);
	}
}
