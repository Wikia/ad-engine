import {
	AdEngineRunnerSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
	LoadTimesSetup,
	NoAdsDetector,
	TrackingParametersSetup,
	TrackingSetup,
	getDeviceMode,
	NoAdsMode,
	BaseContextSetup,
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
import { FanCentralAdsMode } from './modes/fan-central-ads-mode.service';
import { FanCentralDynamicSlotsSetup } from './setup/dynamic-slots/fan-central-dynamic-slots.setup';
import { FanCentralSlotsContextSetup } from './setup/context/slots/fan-central-slots-context.setup';
import { FanCentralTargetingSetup } from './setup/context/targeting/fan-central-targeting.setup';
import { FanCentralTemplatesSetup } from './templates/fan-central-templates.setup';

@Injectable()
export class FanCentralPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			TrackingParametersSetup,
			() => context.set('state.isMobile', getDeviceMode() === 'mobile'),
			FanCentralTargetingSetup,
			LoadTimesSetup,
			BaseContextSetup,
			FanCentralSlotsContextSetup,
			FanCentralDynamicSlotsSetup,
			FanCentralTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: FanCentralAdsMode,
				no: NoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
