import {
	adEngineConfigured,
	BaseContextSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	NoAdsDetector,
	WikiContextSetup,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { BingeBotIocSetup } from './bingebot-ioc-setup';
import { BingeBotAdsMode } from './modes/bingebot-ads.mode';
import { BingeBotSlotsContextSetup } from './setup/context/slots/bingebot-slots-context.setup';
import { BingeBotTargetingSetup } from './setup/context/targeting/bingebot-targeting.setup';
import { BingeBotDynamicSlotsSetup } from './setup/dynamic-slots/bingebot-dynamic-slots.setup';
import { BingeBotBeforeViewChangeSetup } from './setup/hooks/bingebot-before-view-change-setup';
import { BingeBotTemplatesSetup } from './templates/bingebot-templates.setup';

@Injectable()
export class BingeBotPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			BingeBotIocSetup,
			WikiContextSetup,
			BaseContextSetup,
			BingeBotSlotsContextSetup,
			BingeBotTargetingSetup,
			BingeBotDynamicSlotsSetup,
			BingeBotTemplatesSetup,
			BingeBotBeforeViewChangeSetup,
			() => communicationService.dispatch(adEngineConfigured()),
		);

		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: BingeBotAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
