import {
	context,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class BfaaFutheadConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = ['cdm-zone-02', 'cdm-zone-04'];
		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);
		context.set('slots.cdm-zone-04.viewportConflicts', []);
		context.set('slots.cdm-zone-04.sizes', []);
		context.set('slots.cdm-zone-04.defaultSizes', [[3, 3]]);
	}

	async onLeave(): Promise<void> {}
}
