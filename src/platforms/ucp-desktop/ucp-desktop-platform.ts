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
import {
	communicationService,
	conditional,
	context,
	eventsRepository,
	IdentitySetup,
	logVersion,
	parallel,
	ProcessPipeline,
	sequential,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpDesktopAdsMode } from './modes/ucp-desktop-ads.mode';
import { UcpDesktopA9ConfigSetup } from './setup/context/a9/ucp-desktop-a9-config.setup';
import { UcpDesktopBaseContextSetup } from './setup/context/base/ucp-desktop-base-context.setup';
import { UcpDesktopPrebidConfigSetup } from './setup/context/prebid/ucp-desktop-prebid-config.setup';
import { UcpDesktopSlotsContextSetup } from './setup/context/slots/ucp-desktop-slots-context.setup';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';

@Injectable()
export class UcpDesktopPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		logVersion();
		context.extend(basicContext);

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
			UcpDesktopBaseContextSetup,
			UcpDesktopSlotsContextSetup,
			IdentitySetup,
			UcpTargetingSetup,
			LoadTimesSetup,
			UcpDesktopPrebidConfigSetup,
			UcpDesktopA9ConfigSetup,
			UcpDesktopDynamicSlotsSetup,
			UcpDesktopTemplatesSetup,
			SequentialMessagingSetup,
			BiddersStateSetup,
			BiddersTargetingUpdater,
			LabradorSetup,
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpDesktopAdsMode,
				no: NoAdsMode,
			}),
			TrackingSetup,
			SlotTrackingSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			PostAdStackPartnersSetup,
		);

		this.pipeline.execute();
	}
}
