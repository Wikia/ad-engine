import { AdSlot } from '../models';
import { logger } from '../utils';
import { stringBuilder } from '../utils/string-builder';
import { context } from './context-service';
import { events, eventService } from './events';
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

	if (
		!!container &&
		(context.get('options.gamLazyLoading.enabled') ||
			context.get('options.nonLazyIncontents.enabled'))
	) {
		context.get('state.adStack').push({
			id: slotName,
		});
	}
	const additionalClasses = repeatConfig.additionalClasses || '';

	if (container !== null) {
		container.className = `${adSlot.getElement().className} ${additionalClasses}`;

		return true;
	}

	return false;
}

function handleSlotRepeating(adSlot: AdSlot): boolean {
	if (adSlot.isEnabled() && adSlot.isRepeatable()) {
		return repeatSlot(adSlot);
	}

	return false;
}

async function injectNextSlot(adSlot: AdSlot): Promise<boolean> {
	const adProduct: string = adSlot.config.adProduct;

	if (adProduct === 'top_boxad') {
		await context.get(`bidders.prebid.bidsRefreshing.incontent_boxad_1.finished`);
		slotInjector.inject('incontent_boxad_1');
		context.push('state.adStack', { id: 'incontent_boxad_1' });
		return false;
	}
	if (adProduct.indexOf('incontent_boxad') !== 0) {
		return false;
	}

	return handleSlotRepeatingWhenBidsRefreshed(adSlot);
}

async function handleSlotRepeatingWhenBidsRefreshed(adSlot: AdSlot): Promise<boolean> {
	const adProduct: string = adSlot.config.adProduct;
	const currentBoxadNumber: number = parseInt(adProduct.split('_').pop(), 10);
	const nextBoxad = `incontent_boxad_${currentBoxadNumber + 1}`;

	logger(logGroup, `repeating waiting: ${nextBoxad}`);
	await context.get(`bidders.prebid.bidsRefreshing.${nextBoxad}.finished`);
	logger(logGroup, `repeating started: ${nextBoxad}`);

	return handleSlotRepeating(adSlot);
}

class SlotRepeater {
	init(): void {
		if (context.get('options.slotRepeater')) {
			if (context.get('options.gamLazyLoading.enabled')) {
				eventService.on(events.AD_SLOT_CREATED, (adSlot: AdSlot) => handleSlotRepeating(adSlot));
			} else if (context.get('options.nonLazyIncontents.enabled')) {
				eventService.on(events.AD_SLOT_CREATED, (adSlot: AdSlot) => {
					adSlot.loaded.then(() => injectNextSlot(adSlot));
				});
			} else {
				context.push('listeners.slot', {
					onRenderEnded: (adSlot: AdSlot) => handleSlotRepeating(adSlot),
				});
			}
		}
	}
}

export const slotRepeater = new SlotRepeater();
