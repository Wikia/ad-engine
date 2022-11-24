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
export class BfaaFanCentralConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = ['top_boxad'];
		const isMobile = context.get('state.isMobile');

		if (this.params.newTakeoverConfig) {
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_NTC_LOADED);

			if (isMobile) {
				enabledSlots.push('floor_adhesion');
			}
		}

		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);
	}
}
