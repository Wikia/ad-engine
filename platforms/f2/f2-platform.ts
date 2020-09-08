import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	TrackingSetup,
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
import { F2IocSetup } from './f2-ioc-setup';
import { F2AdsMode } from './modes/f2-ads.mode';
import { F2Environment } from './setup-f2';
import { F2SlotsContextSetup } from './setup/context/slots/f2-slots-context.setup';
import { F2TargetingSetup } from './setup/context/targeting/f2-targeting.setup';
import { F2DynamicSlotsSetup } from './setup/dynamic-slots/f2-dynamic-slots.setup';
import { F2BaseContextSetup } from './setup/f2-base-context.setup';
import { F2TemplateSetup } from './templates/f2-template.setup';

@Injectable()
export class F2Platform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(f2env: F2Environment): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			F2IocSetup,
			WikiContextSetup,
			() => context.set('state.isMobile', f2env.isPageMobile),
			F2BaseContextSetup,
			F2SlotsContextSetup,
			F2TargetingSetup,
			F2DynamicSlotsSetup,
			F2TemplateSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.dispatch(adEngineConfigured()),
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
