import { slotsContext } from '@platforms/shared';
import {
	context,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_ENV, F2Environment } from '../../../setup-f2';

@Injectable({ autobind: false })
export class BfaaF2ConfigHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(F2_ENV) private f2Env: F2Environment,
	) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = ['top_boxad', 'incontent_boxad', 'bottom_leaderboard'];
		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);
		context.set('slots.bottom_leaderboard.viewportConflicts', []);

		const additionalSizes =
			this.f2Env.siteType === 'app' || this.f2Env.skinName === 'fandom_mobile'
				? universalAdPackage.UAP_ADDITIONAL_SIZES.mobile
				: universalAdPackage.UAP_ADDITIONAL_SIZES.desktop;

		slotsContext.setupSlotSizeOverwriting(additionalSizes);
		slotsContext.addSlotSize('top_boxad', additionalSizes.companionSize);
		slotsContext.addSlotSize('incontent_boxad', additionalSizes.companionSize);
		slotsContext.setSlotSize('bottom_leaderboard', additionalSizes.bfaSize);
	}
}
