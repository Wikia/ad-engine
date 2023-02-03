import { AdEngineRunnerSetup, bootstrapAndGetConsent, GptSetup } from '@platforms/shared';
import { communicationService, context, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { TestPageSlotsContextSetup } from './setup/context/slots/test-page-slots-context.setup';
import { TestPageTargetingSetup } from './setup/context/targeting/test-page-targeting.setup';
import { TestPageDynamicSlotsSetup } from './setup/dynamic-slots/test-page-dynamic-slots.setup';
import { TestPageSlotsStateSetup } from './setup/state/slots/test-page-slots-state.setup';
import { TestPageIocSetup } from './test-page-ioc-setup';

@Injectable()
export class TestPagePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => bootstrapAndGetConsent(),
			TestPageIocSetup,
			TestPageSlotsContextSetup,
			TestPageSlotsStateSetup,
			() => {
				context.push('state.adStack', { id: 'top_leaderboard' });
			},
			TestPageDynamicSlotsSetup,
			TestPageTargetingSetup,
			AdEngineRunnerSetup,
			GptSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		this.pipeline.execute().then(() => {
			communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
		});
	}
}
