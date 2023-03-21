import { AdSlot, RepeatConfig } from '../models';
import { generateUniqueId, logger, stringBuilder } from '../utils';
import { context } from './context-service';
import { targetingService } from './targeting-service';

const logGroup = 'slot-repeater';

export class SlotRepeater {
	repeatSlot(adSlot: AdSlot, repeatConfig: RepeatConfig): string {
		const newSlotDefinition = adSlot.getCopy();
		const slotName = stringBuilder.build(repeatConfig.slotNamePattern, {
			slotConfig: {
				...newSlotDefinition,
				repeat: repeatConfig,
			},
		});

		newSlotDefinition.slotName = slotName;

		if (repeatConfig.limit !== null && repeatConfig.index > repeatConfig.limit) {
			logger(logGroup, `Limit reached for ${slotName}`);

			return;
		}

		context.set(`slots.${slotName}`, newSlotDefinition);
		context.set(`slots.${slotName}.uid`, generateUniqueId());

		if (repeatConfig.updateProperties) {
			Object.keys(repeatConfig.updateProperties).forEach((key) => {
				let value = repeatConfig.updateProperties[key];

				if (typeof value === 'string') {
					value = stringBuilder.build(value, {
						slotConfig: {
							...newSlotDefinition,
							repeat: repeatConfig,
						},
					});
				}

				if (key.startsWith('targeting.')) {
					targetingService.set(key.replace('targeting.', ''), value, slotName);
				} else {
					context.set(`slots.${slotName}.${key}`, value);
				}
			});
		}

		return slotName;
	}
}
