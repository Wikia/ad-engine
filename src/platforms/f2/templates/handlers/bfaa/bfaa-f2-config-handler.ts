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
import { AD_ENGINE_UAP_NTC_LOADED } from "../../../../../communication/events/events-ad-engine-uap";

@Injectable({ autobind: false })
export class BfaaF2ConfigHandler implements TemplateStateHandler {
	private enabledSlots: string[] = ['top_boxad', 'incontent_boxad', 'bottom_leaderboard'];

	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		const isMobile = context.get('state.isMobile');

		if (!isMobile) {
			this.configureFloorAdhesionExperiment();
		}

		if (this.params.newTakeoverConfig) {
			communicationService.emit(AD_ENGINE_UAP_NTC_LOADED);

			if (isMobile) {
				this.enabledSlots.push('floor_adhesion');
			}
		}

		universalAdPackage.init(
			this.params,
			this.enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !this.enabledSlots.includes(slotName),
			),
		);
		context.set('slots.bottom_leaderboard.viewportConflicts', []);

		const bfaSize = isMobile
			? universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile
			: universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop;

		slotsContext.setSlotSize('bottom_leaderboard', bfaSize);
	}

	private configureFloorAdhesionExperiment() {
		if (context.get('options.ntc.floorEnabled')) {
			this.enabledSlots.push('floor_adhesion');
		}
	}
}
