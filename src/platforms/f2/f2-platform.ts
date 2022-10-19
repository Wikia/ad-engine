import {
	AdEngineRunnerSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
	LoadTimesSetup,
	NoAdsDetector,
	SequentialMessagingSetup,
	TrackingParametersSetup,
	TrackingSetup,
	PlatformContextSetup,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	eventsRepository,
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { F2AdsMode } from './modes/f2-ads-mode.service';
import { F2BaseContextSetup } from './setup/context/base/f2-base-context.setup';
import { F2DynamicSlotsSetup } from './setup/dynamic-slots/f2-dynamic-slots.setup';
import { F2Environment } from './setup-f2';
import { F2IocSetup } from './f2-ioc-setup';
import { F2SlotsContextSetup } from './setup/context/slots/f2-slots-context.setup';
import { F2TargetingSetup } from './setup/context/targeting/f2-targeting.setup';
import { F2TemplatesSetup } from './templates/f2-templates.setup';

@Injectable()
export class F2Platform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(f2env: F2Environment): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			F2IocSetup,
			TrackingParametersSetup,
			() => context.set('state.isMobile', f2env.isPageMobile),
			F2TargetingSetup,
			LoadTimesSetup,
			F2BaseContextSetup,
			F2SlotsContextSetup,
			F2DynamicSlotsSetup,
			F2TemplatesSetup,
			SequentialMessagingSetup, // SequentialMessagingSetup needs to be after *TemplatesSetup or UAP SM might break
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: F2AdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
