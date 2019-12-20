import { AdSlot } from '../models';
import { logger } from '../utils';
import { stringBuilder } from '../utils/string-builder';
import { context } from './context-service';
import { eventService } from './events';
import { slotInjector } from './slot-injector';

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

			context.set(`slots.${slotName}.${key}`, value);
		});
	}

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
		eventService.on(AdSlot.SLOT_RENDERED_EVENT, (adSlot: AdSlot) => {
			if (adSlot.isEnabled() && adSlot.isRepeatable()) {
				return repeatSlot(adSlot);
			}

			return false;
		});
	}
}

export const slotRepeater = new SlotRepeater();
