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
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class BfaaUcpDesktopConfigHandler implements TemplateStateHandler {
	private enabledSlots: string[] = [
		'top_boxad',
		'incontent_boxad_1',
		'bottom_leaderboard',
		'gallery_leaderboard',
		'fandom_dt_galleries',
	];

	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		this.configureFloorAdhesionExperiment();

		if (this.params.newTakeoverConfig) {
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_NTC_LOADED);
		}

		universalAdPackage.init(
			this.params,
			this.enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !this.enabledSlots.includes(slotName),
			),
		);

		context.set('slots.bottom_leaderboard.viewportConflicts', []);

		slotsContext.setSlotSize(
			'bottom_leaderboard',
			universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
		);
		slotsContext.addSlotSize(
			'bottom_leaderboard',
			universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.unified,
		);
	}

	private configureFloorAdhesionExperiment() {
		if (context.get('options.ntc.floorEnabled')) {
			this.enabledSlots = [
				'top_boxad',
				'incontent_boxad_1',
				'bottom_leaderboard',
				'floor_adhesion',
			];

			document.body.classList.add('floor-adhesion-experiment');
		}
	}
}
