import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context } from '@ad-engine/core';
import { conditional, parallel, ProcessPipeline } from '@ad-engine/pipeline';
import { logVersion } from '@ad-engine/utils';
import {
	BaseContextSetup,
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	NoAdsDetector,
	NoAdsMode,
	SlotTrackingSetup,
} from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { BingeBotAdsMode } from './modes/bingebot-ads.mode';
import { BingeBotSlotsContextSetup } from './setup/context/slots/bingebot-slots-context.setup';
import { BingeBotTargetingSetup } from './setup/context/targeting/bingebot-targeting.setup';
import { BingeBotTrackingSetup } from './setup/context/tracking/bingebot-tracking.setup';
import { BingeBotDynamicSlotsSetup } from './setup/dynamic-slots/bingebot-dynamic-slots.setup';
import { BingeBotBeforeViewChangeSetup } from './setup/hooks/bingebot-before-view-change.setup';
import { BingeBotTemplatesSetup } from './templates/bingebot-templates.setup';

@Injectable()
export class BingeBotPlatform {
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
			SlotTrackingSetup,
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
