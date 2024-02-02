import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context } from '@ad-engine/core';
import { conditional, parallel, ProcessPipeline, sequential } from '@ad-engine/pipeline';
import { client, logVersion } from '@ad-engine/utils';
import {
	BaseContextSetup,
	BiddersStateSetup,
	BiddersTargetingUpdater,
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	LabradorSetup,
	LoadTimesSetup,
	MetricReporterSetup,
	NoAdsDetector,
	NoAdsMode,
	PlatformContextSetup,
	PreloadedLibrariesSetup,
	SlotTrackingSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { IdentitySetup } from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';
import { getBasicContext } from './ad-context';
import { SportsAdsMode } from './modes/sports-ads.mode';
import { SportsA9ConfigSetup } from './setup/context/a9/sports-a9-config.setup';
import { SportsPrebidConfigSetup } from './setup/context/prebid/sports-prebid-config.setup';
import { SportsSlotsContextSetup } from './setup/context/slots/sports-slots-context.setup';
import { SportsTargetingSetup } from './setup/context/targeting/sports-targeting.setup';
import { SportsDynamicSlotsSetup } from './setup/dynamic-slots/sports-dynamic-slots.setup';
import { SportsTemplatesSetup } from './templates/sports-templates.setup';
import { selectApplication } from './utils/application-helper';

@Injectable()
export class SportsPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		logVersion();
		context.extend(getBasicContext());
		context.set('state.isMobile', client.getDeviceMode() === 'mobile');
		document.body.classList.add(`ae-${selectApplication('futhead', 'muthead')}`);

		// Config
		this.pipeline.add(
			PlatformContextSetup,
			async () => await ensureGeoCookie(),
			parallel(
				sequential(InstantConfigSetup, PreloadedLibrariesSetup),
				ConsentManagementPlatformSetup,
			),
			TrackingParametersSetup,
			MetricReporterSetup,
			IdentitySetup,
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
			SlotTrackingSetup,
			TrackingSetup,
			BiddersTargetingUpdater,
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
