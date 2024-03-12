import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context } from '@ad-engine/core';
import { conditional, parallel, ProcessPipeline, sequential } from '@ad-engine/pipeline';
import { logVersion } from '@ad-engine/utils';
import {
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
	PostAdStackPartnersSetup,
	PreloadedLibrariesSetup,
	SequentialMessagingSetup,
	SlotTrackingSetup,
	TrackingParametersSetup,
	TrackingSetup,
	UcpTargetingSetup,
} from '@platforms/shared';
import { IdentitySetup } from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpMobileAdsMode } from './modes/ucp-mobile-ads.mode';
import { UcpMobileA9ConfigSetup } from './setup/context/a9/ucp-mobile-a9-config.setup';
import { UcpMobileBaseContextSetup } from './setup/context/base/ucp-mobile-base-context.setup';
import { UcpMobilePrebidConfigSetup } from './setup/context/prebid/ucp-mobile-prebid-config.setup';
import { UcpMobileSlotsContextSetup } from './setup/context/slots/ucp-mobile-slots-context.setup';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';

@Injectable()
export class UcpMobilePlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		logVersion();
		context.extend(basicContext);
		context.set('state.isMobile', true);

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
			UcpMobileBaseContextSetup,
			UcpMobileSlotsContextSetup,
			IdentitySetup,
			UcpTargetingSetup,
			LoadTimesSetup,
			UcpMobilePrebidConfigSetup,
			UcpMobileA9ConfigSetup,
			UcpMobileDynamicSlotsSetup,
			UcpMobileTemplatesSetup,
			SequentialMessagingSetup, // SequentialMessagingSetup needs to be after *TemplatesSetup or UAP SM will break
			BiddersStateSetup,
			BiddersTargetingUpdater,
			LabradorSetup,
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpMobileAdsMode,
				no: NoAdsMode,
			}),
			SlotTrackingSetup,
			TrackingSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			PostAdStackPartnersSetup,
		);

		this.pipeline.execute();
	}
}
