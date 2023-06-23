import { BaseSlotConfig, context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { SlotsStickyActivationHandler } from '../../../../shared/dynamic-slots/specific-handler/slots-sticky-activation-handler';

@Injectable()
export class NewsAndRatingsLocTopStickinessSetup implements DiProcess {
	execute(): void {
		const slotsConfigWithLocTop = this.getSlotsNamesWithLocTop();

		new SlotsStickyActivationHandler(slotsConfigWithLocTop).handle();
	}

	private getSlotsNamesWithLocTop(): string[] | null {
		const allSlotsConfigs = context.get('slots');
		const result = [];
		Object.entries<BaseSlotConfig>(allSlotsConfigs).forEach(([slotName, config]) => {
			if (config?.targeting?.loc === 'top') {
				result.push(slotName);
			}
		});

		return result || null;
	}
}
