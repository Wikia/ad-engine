import { insertSlots, SlotSetupDefinition } from '@platforms/shared';
import {
	AdSlotEvent,
	communicationService,
	context,
	Dictionary,
	DiProcess,
	eventsRepository,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NewsAndRatingsSlotsDefinitionRepository } from '../../../shared';

const logGroup = 'dynamic-slots';

@Injectable()
export class NewsAndRatingsDynamicSlotsNeutronSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository) {}

	private repeatedSlotsCounter: Dictionary<number> = {};
	private repeatedSlotsRendered: string[] = [];
	private repeatedSlotsQueue: Dictionary<[string, string]> = {};
	private firstCallSlotName: string;

	execute(): void {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			communicationService.on(
				eventsRepository.PLATFORM_AD_PLACEMENT_READY,
				({ placementId }) => {
					if (!placementId) {
						return;
					}

					if (placementId.includes('skybox')) {
						context.set('slots.top_leaderboard.bidderAlias', placementId);
						context.set('slots.top_leaderboard.targeting.pos', ['top_leaderboard', placementId]);
						document.querySelector(`.c-adDisplay_container > div[data-ad="${placementId}"]`).id =
							'top_leaderboard';
						this.firstCallSlotName = placementId;
						placementId = 'top_leaderboard';
					}

					utils.logger(logGroup, 'Ad placement rendered', placementId);

					if (this.repeatedSlotsCounter[placementId]) {
						this.scheduleRepeatedSlotInjection(placementId);
						return;
					}

					this.repeatedSlotsCounter[placementId] = 1;
					insertSlots([this.getSlotConfig(placementId)]);
				},
				false,
			);

			communicationService.onSlotEvent(AdSlotEvent.SLOT_RENDERED_EVENT, ({ adSlotName }) => {
				this.repeatedSlotsRendered.push(adSlotName);

				if (this.repeatedSlotsQueue[adSlotName]) {
					const [nextSlotName, placementId] = this.repeatedSlotsQueue[adSlotName];
					window.requestAnimationFrame(() => {
						insertSlots([this.getSlotConfig(nextSlotName, placementId)]);
					});
				}
			});
			insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
			utils.logger(logGroup, 'Inserting slots without DOM elements');
			insertSlots([this.slotsDefinitionRepository.getInterstitialConfig()]);
		});

		communicationService.on(
			eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE,
			() => {
				utils.logger(logGroup, 'Cleaning slots repositories');
				this.repeatedSlotsCounter = {};
				this.repeatedSlotsRendered = [];
				this.repeatedSlotsQueue = {};

				utils.logger(logGroup, 'Removing slots without DOM elements');
				document.getElementById('floor_adhesion')?.remove();
				document.getElementById('incontent_player')?.remove();
			},
			false,
		);

		communicationService.on(
			eventsRepository.PLATFORM_PAGE_CHANGED,
			() => {
				this.refreshStaleSlots();
			},
			false,
		);
	}

	private scheduleRepeatedSlotInjection(placementId: string): void {
		const counter = this.repeatedSlotsCounter[placementId];
		const [currentSlotName, nextSlotName] =
			counter === 1
				? [placementId, `${placementId}-2`]
				: [`${placementId}-${counter}`, `${placementId}-${counter + 1}`];

		this.repeatedSlotsCounter[placementId] = counter + 1;

		if (this.repeatedSlotsRendered.includes(currentSlotName)) {
			insertSlots([this.getSlotConfig(nextSlotName, placementId)]);
			utils.logger(logGroup, 'Injecting repeated slot', nextSlotName);
		} else {
			this.repeatedSlotsQueue[currentSlotName] = [nextSlotName, placementId];
			utils.logger(logGroup, 'Scheduling repeated slot injection', nextSlotName);
		}
	}

	private refreshStaleSlots(): void {
		const domSlotsElements = document.querySelectorAll('div[data-slot-loaded="true"].gpt-ad');

		domSlotsElements.forEach((slot) => {
			utils.logger(logGroup, 'Reinjecting stale slot', slot.getAttribute('data-ad'));
			communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
				placementId: slot.getAttribute('data-ad'),
			});
		});
		utils.logger(logGroup, 'Reinjecting floor_adhesion');
		insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
	}

	private isSlotApplicable(slotName: string): boolean {
		return Object.keys(context.get('slots')).includes(slotName) || slotName.includes('skybox');
	}

	private getSlotConfig(slotName: string, baseSlotName = ''): SlotSetupDefinition {
		const domSlotElement: HTMLElement =
			document.getElementById(slotName) ||
			document.querySelector(`div[data-ad="${baseSlotName || slotName}"]:not(.gpt-ad)`);

		if (!domSlotElement || !this.isSlotApplicable(slotName)) {
			utils.logger(logGroup, 'Slot is not applicable or placement not exists', slotName);
			return null;
		}

		const slotConfig: SlotSetupDefinition = {
			slotCreatorConfig: {
				slotName,
				insertMethod: 'alter',
				anchorSelector: '',
				anchorElement: domSlotElement,
				classList: ['hidden-ad', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};

		const uapKeyval = targetingService.get('uap', 'top_leaderboard');
		const uapCreativeKeyval = targetingService.get('uap_c', 'top_leaderboard');

		if (uapKeyval && uapCreativeKeyval) {
			context.set(`slots.${slotName}.targeting.uap`, uapKeyval);
			context.set(`slots.${slotName}.targeting.uap_c`, uapCreativeKeyval);
		}

		if (!baseSlotName) {
			context.set(
				`slots.${slotName}.bidderAlias`,
				slotName.includes('top_leaderboard') ? this.firstCallSlotName : slotName,
			);

			slotConfig.slotCreatorConfig.repeat = {
				index: 1,
				limit: 10,
				slotNamePattern: `{slotConfig.bidderAlias}-{slotConfig.repeat.index}`,
				updateProperties: {
					adProduct: '{slotConfig.slotName}',
					'targeting.pos': '{slotConfig.slotName}',
				},
				updateCreator: {
					anchorElement: null,
				},
			};
		}

		return slotConfig;
	}
}
