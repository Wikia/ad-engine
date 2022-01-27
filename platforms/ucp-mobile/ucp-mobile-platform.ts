import {
	AdEngineRunnerSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	SequentialMessagingSetup,
	TrackingSetup,
	UcpNoAdsMode,
	UcpTargetingSetup,
	WikiContextSetup,
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
import { UcpMobileAdsMode } from './modes/ucp-mobile-ads.mode';
import { UcpMobileA9ConfigSetup } from './setup/context/a9/ucp-mobile-a9-config.setup';
import { UcpMobileBaseContextSetup } from './setup/context/base/ucp-mobile-base-context.setup';
import { UcpMobilePrebidConfigSetup } from './setup/context/prebid/ucp-mobile-prebid-config.setup';
import { UcpMobileSlotsContextSetup } from './setup/context/slots/ucp-mobile-slots-context.setup';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';
import { UcpMobileIocSetup } from './ucp-mobile-ioc-setup';

@Injectable()
export class UcpMobilePlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			UcpMobileIocSetup,
			WikiContextSetup,
			() => context.set('state.isMobile', true),
			UcpMobileBaseContextSetup,
			UcpMobileSlotsContextSetup,
			UcpTargetingSetup,
			SequentialMessagingSetup,
			UcpMobilePrebidConfigSetup,
			UcpMobileA9ConfigSetup,
			UcpMobileDynamicSlotsSetup,
			BiddersStateSetup,
			UcpMobileTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpMobileAdsMode,
				no: UcpNoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
