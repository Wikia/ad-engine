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
export class BfaaUcpDesktopConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = ['top_boxad', 'incontent_boxad_1', 'bottom_leaderboard'];

		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);

		context.set('slots.bottom_leaderboard.viewportConflicts', []);

		// TODO SM set size here (option 1 of 2)
		slotsContext.setSlotSize(
			'bottom_leaderboard',
			universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
		);
	}
}
