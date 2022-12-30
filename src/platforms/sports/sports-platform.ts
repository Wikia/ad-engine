import {
	AdEngineRunnerSetup,
	BaseContextSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	ensureGeoCookie,
	getDeviceMode,
	InstantConfigSetup,
	LabradorSetup,
	LoadTimesSetup,
	NoAdsDetector,
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
import { getBasicContext } from './ad-context';
import { SportsAdsMode } from './modes/ads/sports-ads.mode';
import { SportsAdsDeprecatedMode } from './modes/ads/sports-ads-deprecated.mode';
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
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			SportsIocSetup,
			TrackingParametersSetup,
			() => context.set('state.isMobile', getDeviceMode() === 'mobile'),
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
				yes: conditional(() => context.get('options.adsInitializeV2'), {
					yes: SportsAdsMode,
					no: SportsAdsDeprecatedMode,
				}),
			}),
		);

		this.pipeline.execute();
	}
}
