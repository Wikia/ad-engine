import {
	BaseContextSetup,
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	NoAdsDetector,
	NoAdsMode,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	DiProcess,
	eventsRepository,
	logVersion,
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { BingeBotAdsMode } from './modes/bingebot-ads.mode';
import { BingeBotSlotsContextSetup } from './setup/context/slots/bingebot-slots-context.setup';
import { BingeBotTargetingSetup } from './setup/context/targeting/bingebot-targeting.setup';
import { BingeBotTrackingSetup } from './setup/context/tracking/bingebot-tracking.setup';
import { BingeBotDynamicSlotsSetup } from './setup/dynamic-slots/bingebot-dynamic-slots.setup';
import { BingeBotBeforeViewChangeSetup } from './setup/hooks/bingebot-before-view-change.setup';
import { BingeBotTemplatesSetup } from './templates/bingebot-templates.setup';

import './styles.scss';

@Injectable()
export class BingeBotPlatform implements DiProcess {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		logVersion();
		context.extend(basicContext);

		this.pipeline.add(
			async () => await ensureGeoCookie(),
			parallel(InstantConfigSetup, ConsentManagementPlatformSetup),
			BaseContextSetup,
			BingeBotSlotsContextSetup,
			BingeBotTargetingSetup,
			BingeBotDynamicSlotsSetup,
			BingeBotTemplatesSetup,
			BingeBotTrackingSetup,
			BingeBotBeforeViewChangeSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: BingeBotAdsMode,
				no: NoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
