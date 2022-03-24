import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, SlotConfig } from '../models';
import { logger } from '../utils';
import { context } from './context-service';
import { SlotCreator, SlotCreatorConfig } from './slot-creator';
import { slotService } from './slot-service';
import { btfBlockerService } from './btf-blocker-service';
import { universalAdPackage } from '../../ad-products';

const logGroup = 'slot-repeater';

class SlotInjector {
	private slotCreator = new SlotCreator();

	constructor() {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot: adSlot }) => {
				const slotsToPush: string[] = adSlot.getSlotsToPushAfterCreated();

				slotsToPush.forEach((slotName: string) => {
					const slotElement = this.inject(slotName, true);

					if (slotElement) {
						slotService.pushSlot(slotElement);
					} else {
						logger(logGroup, `Could not push slot ${slotName}.`);
					}
				});
			},
			false,
		);

		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot: adSlot }) => {
				const slotsToInject: string[] = adSlot.getSlotsToInjectAfterRendered();

				slotsToInject.forEach((slotName: string) => {
					this.inject(slotName);
				});
			});
		});
	}

	inject(slotName: string, disablePushOnScroll?: boolean): HTMLElement | null {
		// @TODO: run only if top_leaderboard is disabled
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			btfBlockerService.finishFirstCall();
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
				isLoaded: universalAdPackage.isFanTakeoverLoaded(),
				adProduct: universalAdPackage.getType(),
			});
		});

		let container: HTMLElement;
		const config: SlotConfig = context.get(`slots.${slotName}`);
		const slotConfig: SlotCreatorConfig = {
			slotName,
			anchorSelector: config.parentContainerSelector || config.insertBeforeSelector,
			insertMethod: config.parentContainerSelector
				? config.insertIntoParentContainerMethod || 'append'
				: 'before',
			placeholderConfig: config.placeholder,
		};

		if (config.insertBelowFirstViewport) {
			slotConfig.anchorPosition = 'belowFirstViewport';
		}

		if (config.repeat && config.repeat.insertBelowScrollPosition) {
			slotConfig.anchorPosition = 'belowScrollPosition';
		}

		if (config.avoidConflictWith) {
			slotConfig.avoidConflictWith = [config.avoidConflictWith];
		}

		try {
			container = this.slotCreator.createSlot(slotConfig);
		} catch (e) {
			logger(logGroup, `There is not enough space for ${slotName}`);

			return null;
		}

		if (this.getDisablePushOnScroll(disablePushOnScroll, config) === false) {
			context.push('events.pushOnScroll.ids', slotName);
		}

		logger(logGroup, 'Inject slot', slotName);

		return container;
	}

	private getDisablePushOnScroll(input: boolean | undefined, config: SlotConfig): boolean {
		if (typeof input === 'boolean') {
			return input;
		}

		return config.repeat ? !!config.repeat.disablePushOnScroll : false;
	}
}

export const slotInjector = new SlotInjector();
