import { bidders, events, eventService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdEngineRunnerSetup } from './_ad-engine-runner.setup';
import { DelayModulesSetup } from './delay-modules/_delay-modules.setup';

const logGroup = 'ad-engine';

@Injectable()
export class CommonAdEngineRunnerSetup implements AdEngineRunnerSetup {
	constructor(private delayModulesSetup: DelayModulesSetup) {}

	configureAdEngineRunner(): void {
		this.delayModulesSetup.configureDelayModules();
		this.configureEventService();
	}

	private configureEventService(): void {
		eventService.on(events.AD_SLOT_CREATED, (slot) => {
			utils.logger(logGroup, `Created ad slot ${slot.getSlotName()}`);
			bidders.updateSlotTargeting(slot.getSlotName());
		});
	}
}
