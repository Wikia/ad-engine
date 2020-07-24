import { DynamicSlotsSetup, slotsContext } from '@platforms/shared';
import {
	btfBlockerService,
	communicationService,
	context,
	events,
	eventService,
	ofType,
	SlotCreator,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take, tap } from 'rxjs/operators';
import { f2ArticleFeedLoaded, f2FeedLoaded } from '../../f2.actions';
import { F2SlotsDefinitionRepository, SlotSetupDefinition } from './f2-slots-definition-repository';

@Injectable()
export class F2DynamicSlotsSetup implements DynamicSlotsSetup {
	constructor(
		private slotCreator: SlotCreator,
		private slotsDefinitionRepository: F2SlotsDefinitionRepository,
	) {}

	configureDynamicSlots(): void {
		this.injectSlots();
		this.configureTopLeaderboard();
	}

	private injectSlots(): void {
		const topLeaderboardDefinition = this.slotsDefinitionRepository.getTopLeaderboardConfig();

		this.insertSlots([
			topLeaderboardDefinition,
			this.slotsDefinitionRepository.getIncontentBoxadConfig(),
		]);

		communicationService.action$
			.pipe(
				ofType(f2ArticleFeedLoaded, f2FeedLoaded),
				take(1),
				tap(() => {
					this.insertSlots([
						this.slotsDefinitionRepository.getTopBoxadConfig(),
						this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
						this.slotsDefinitionRepository.getFeedBoxadConfig(),
					]);
				}),
			)
			.subscribe();

		if (!topLeaderboardDefinition) {
			eventService.once(events.AD_STACK_START, () => btfBlockerService.finishFirstCall());
		}
	}

	private insertSlots(slotsToInsert: SlotSetupDefinition[]): void {
		slotsToInsert
			.filter((config) => !!config)
			.forEach(({ slotCreatorConfig, slotCreatorWrapperConfig, activator }) => {
				try {
					this.slotCreator.createSlot(slotCreatorConfig, slotCreatorWrapperConfig);
					if (activator) {
						activator();
					}
				} catch (e) {
					slotsContext.setState(slotCreatorConfig.slotName, false);
				}
			});
	}

	private configureTopLeaderboard(): void {
		if (!context.get('custom.hasFeaturedVideo') && context.get('templates.stickyTlb.lineItemIds')) {
			context.set('templates.stickyTlb.enabled', true);
			context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
		}
		context.set('templates.stickyTLB.enabled', true);
	}
}
