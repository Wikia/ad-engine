import {
	AdEngineRunnerSetup,
	AdEngineStarter,
	BaseContextSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	ensureGeoCookie,
	getDeviceMode,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	TrackingSetup,
	wadRunner,
	WikiContextSetup,
} from '@platforms/shared';
import {
	audigent,
	bidders,
	communicationService,
	conditional,
	confiant,
	context,
	durationMedia,
	eventsRepository,
	iasPublisherOptimization,
	parallel,
	ProcessPipeline,
	ProcessStepUnion,
	sequential,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getBasicContext } from './ad-context';
import { SportsA9ConfigSetup } from './setup/context/a9/sports-a9-config.setup';
import { SportsPrebidConfigSetup } from './setup/context/prebid/sports-prebid-config.setup';
import { SportsSlotsContextSetup } from './setup/context/slots/sports-slots-context.setup';
import { SportsTargetingSetup } from './setup/context/targeting/sports-targeting.setup';
import { SportsDynamicSlotsSetup } from './setup/dynamic-slots/sports-dynamic-slots.setup';
import { SportsIocSetup } from './sports-ioc-setup';
import { SportsTemplatesSetup } from './templates/sports-templates.setup';
import { selectApplication } from './utils/application-helper';

@Injectable()
export class SportsPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(getBasicContext()),
			() => document.body.classList.add(`ae-${selectApplication('futhead', 'muthead')}`),
			() => ensureGeoCookie(),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			SportsIocSetup,
			WikiContextSetup,
			() => context.set('state.isMobile', getDeviceMode() === 'mobile'),
			BaseContextSetup,
			SportsSlotsContextSetup,
			SportsTargetingSetup,
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
				yes: SportsPlatform.sportsAdsMode(),
			}),
		);

		this.pipeline.execute();
	}

	private static sportsAdsMode(): ProcessStepUnion {
		return sequential(
			parallel(audigent, iasPublisherOptimization, confiant, durationMedia),
			new AdEngineStarter(bidders, wadRunner),
		);
	}
}
