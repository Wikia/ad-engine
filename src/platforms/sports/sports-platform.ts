import {
	AdEngineRunnerSetup,
	BaseContextSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	ensureGeoCookie,
	InstantConfigSetup,
	LabradorSetup,
	LoadTimesSetup,
	MetricReporter,
	MetricReporterSetup,
	NoAdsDetector,
	NoAdsMode,
	PlatformContextSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	eventsRepository,
	parallel,
	ProcessPipeline,
	utils,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { getBasicContext } from './ad-context';
import { SportsAdsMode } from './modes/sports-ads.mode';
import { SportsA9ConfigSetup } from './setup/context/a9/sports-a9-config.setup';
import { SportsPrebidConfigSetup } from './setup/context/prebid/sports-prebid-config.setup';
import { SportsSlotsContextSetup } from './setup/context/slots/sports-slots-context.setup';
import { SportsTargetingSetup } from './setup/context/targeting/sports-targeting.setup';
import { SportsDynamicSlotsSetup } from './setup/dynamic-slots/sports-dynamic-slots.setup';
import { SportsTemplatesSetup } from './templates/sports-templates.setup';
import { selectApplication } from './utils/application-helper';

@injectable()
export class SportsPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(getBasicContext()),
			() => context.set('state.isMobile', utils.client.getDeviceMode() === 'mobile'),
			() => document.body.classList.add(`ae-${selectApplication('futhead', 'muthead')}`),
			() => ensureGeoCookie(),
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			TrackingParametersSetup,
			MetricReporterSetup,
			MetricReporter,
			SportsTargetingSetup,
			LoadTimesSetup,
			BaseContextSetup,
			SportsSlotsContextSetup,
			SportsPrebidConfigSetup,
			SportsA9ConfigSetup,
			SportsDynamicSlotsSetup,
			BiddersStateSetup,
			SportsTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: SportsAdsMode,
				no: NoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
