import {
	AdEngineRunnerSetup,
	AdLayoutInitializerSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	NoAdsMode,
	SequentialMessagingSetup,
	TrackingSetup,
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
import { UcpDesktopAdsMode } from './modes/ucp-desktop-ads.mode';
import { UcpDesktopA9ConfigSetup } from './setup/context/a9/ucp-desktop-a9-config.setup';
import { UcpDesktopBaseContextSetup } from './setup/context/base/ucp-desktop-base-context.setup';
import { UcpDesktopPrebidConfigSetup } from './setup/context/prebid/ucp-desktop-prebid-config.setup';
import { UcpDesktopSlotsContextSetup } from './setup/context/slots/ucp-desktop-slots-context.setup';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopSlotsStateSetup } from './setup/state/slots/ucp-desktop-slots-state-setup';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';
import { UcpDesktopIocSetup } from './ucp-desktop-ioc-setup';

@Injectable()
export class UAPScenario {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(SequentialMessagingSetup);

		this.pipeline.execute();
	}
}

@Injectable()
export class NoUAPScenario {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(UcpDesktopPrebidConfigSetup);

		this.pipeline.execute();
	}
}

function isUAPdetected(): Promise<boolean> {
	return new AdLayoutInitializerSetup()
		.execute()
		.then(() => true)
		.catch(() => false);
}

@Injectable()
export class UcpDesktopPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			UcpDesktopIocSetup,
			WikiContextSetup,
			UcpDesktopBaseContextSetup,
			UcpDesktopSlotsContextSetup,
			UcpTargetingSetup,
			conditional(isUAPdetected, {
				yes: UAPScenario,
				no: NoUAPScenario,
			}),
			UcpDesktopA9ConfigSetup,
			UcpDesktopDynamicSlotsSetup,
			UcpDesktopSlotsStateSetup,
			BiddersStateSetup,
			UcpDesktopTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpDesktopAdsMode,
				no: NoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
