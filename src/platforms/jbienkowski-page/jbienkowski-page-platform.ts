import { AdEngineRunnerSetup, bootstrapAndGetConsent } from '@platforms/shared';
import {
	communicationService,
	context,
	eventsRepository,
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { basicContext } from './ad-context';
import { JbienkowskiPageIocSetup } from './jbienkowski-page-ioc-setup';
import { JbienkowskiPageAdsMode } from './modes/jbienkowski-page-ads-mode.service';
import { JbienkowskiPageSlotsContextSetup } from './setup/context/slots/jbienkowski-page-slots-context.setup';
import { JbienkowskiPageTargetingSetup } from './setup/context/targeting/jbienkowski-page-targeting.setup';
import { JbienkowskiPageDynamicSlotsSetup } from './setup/dynamic-slots/jbienkowski-page-dynamic-slots.setup';
import { JbienkowskiSlotsStateSetup } from './setup/state/slots/jbienkowski-slots-state.setup';

@Injectable()
export class JbienkowskiPagePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(JbienkowskiPageIocSetup, () => bootstrapAndGetConsent()),
			JbienkowskiPageSlotsContextSetup,
			JbienkowskiSlotsStateSetup,
			() => {
				context.push('state.adStack', { id: 'top_leaderboard' });
			},
			JbienkowskiPageDynamicSlotsSetup,
			JbienkowskiPageTargetingSetup,
			AdEngineRunnerSetup,
			JbienkowskiPageAdsMode,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		this.pipeline.execute();
	}
}
