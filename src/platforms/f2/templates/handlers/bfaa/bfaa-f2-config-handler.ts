import { slotsContext } from '@platforms/shared';
import {
	communicationService,
	context,
	eventsRepository,
	Optimizely,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

const OPTIMIZELY_NTC_2_0 = {
	EXPERIMENT_ENABLED: 'unified_takeover_ntc20',
	EXPERIMENT_VARIANT: 'unified_takeover_ntc20_variant',
};

const OPTIMIZELY_NTC_2_0_VARIANTS = {
	NEW_VARIANT: 'ntc20_adhesion_enabled',
	OLD_VARIANT: 'ntc20_adhesion_disabled',
	UNDEFINED: 'ntc20_adhesion_undefined',
};

@Injectable({ autobind: false })
export class BfaaF2ConfigHandler implements TemplateStateHandler {
	private enabledSlots: string[] = ['top_boxad', 'incontent_boxad', 'bottom_leaderboard'];

	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams, private optimizely: Optimizely) {}

	async onEnter(): Promise<void> {
		this.configureFloorAdhesionExperiment();
		const isMobile = context.get('state.isMobile');

		if (this.params.newTakeoverConfig) {
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_NTC_LOADED);

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
		this.optimizely.addVariantToTargeting(
			OPTIMIZELY_NTC_2_0,
			OPTIMIZELY_NTC_2_0_VARIANTS.UNDEFINED,
		);

		const variant = this.optimizely.getVariant(OPTIMIZELY_NTC_2_0);

		if (variant) {
			this.optimizely.addVariantToTargeting(OPTIMIZELY_NTC_2_0, variant);

			if (variant === OPTIMIZELY_NTC_2_0_VARIANTS.NEW_VARIANT) {
				this.enabledSlots.push('floor_adhesion');

				document.body.classList.add('floor-adhesion-experiment');
			}
		}
	}
}
