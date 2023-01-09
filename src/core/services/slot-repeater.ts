import { communicationService } from '@ad-engine/communication';
import { AdSlot } from '../models';
import { generateUniqueId, logger } from '../utils';
import { stringBuilder } from '../utils/string-builder';
import { context } from './context-service';
import { slotInjector } from './slot-injector';
import { slotTargetingService } from './slot-targeting-service';

const logGroup = 'slot-repeater';

interface SlotDefinition {
	[key: string]: any;
}

function buildString(pattern: string, definition: SlotDefinition): string {
	return stringBuilder.build(pattern, {
		slotConfig: definition,
	});
}

function repeatSlot(adSlot: AdSlot): boolean {
	const newSlotDefinition = adSlot.getCopy();
	const repeatConfig = newSlotDefinition.repeat;

	repeatConfig.index += 1;

	const slotName = buildString(repeatConfig.slotNamePattern, newSlotDefinition);

	newSlotDefinition.slotName = slotName;

	if (repeatConfig.limit !== null && repeatConfig.index > repeatConfig.limit) {
		logger(logGroup, `Limit reached for ${slotName}`);

		return false;
	}

	context.set(`slots.${slotName}`, newSlotDefinition);

	if (repeatConfig.updateProperties) {
		Object.keys(repeatConfig.updateProperties).forEach((key) => {
			const value =
				typeof repeatConfig.updateProperties[key] === 'string'
					? buildString(repeatConfig.updateProperties[key], newSlotDefinition)
					: repeatConfig.updateProperties[key];

			if (key.startsWith('targeting.')) {
				slotTargetingService.set(slotName, key.replace('targeting.', ''), value);
			} else {
				context.set(`slots.${slotName}.${key}`, value);
			}
		});
	}

	context.set(`slots.${slotName}.uid`, generateUniqueId());

	const container = slotInjector.inject(slotName);
	const additionalClasses = repeatConfig.additionalClasses || '';

	if (container !== null) {
		container.className = `${adSlot.getElement().className} ${additionalClasses}`;

		return true;
	}

	return false;
}

class SlotRepeater {
	init(): void {
		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			if (slot.isEnabled() && slot.isRepeatable()) {
				return repeatSlot(slot);
			}

			return false;
		});
	}
}

export const slotRepeater = new SlotRepeater();
