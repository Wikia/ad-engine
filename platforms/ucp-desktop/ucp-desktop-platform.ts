import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	TrackingSetup,
	UcpBaseContextSetup,
	UcpNoAdsMode,
	UcpTargetingSetup,
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
import { UcpDesktopAdsMode } from './modes/ucp-desktop-ads.mode';
import { UcpDesktopA9ConfigSetup } from './setup/context/a9/ucp-desktop-a9-config.setup';
import { UcpDesktopBillTheLizardSetup } from './setup/context/bill-the-lizard/ucp-desktop-bill-the-lizard.setup';
import { UcpDesktopPrebidConfigSetup } from './setup/context/prebid/ucp-desktop-prebid-config.setup';
import { UcpDesktopSlotsContextSetup } from './setup/context/slots/ucp-desktop-slots-context.setup';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopSlotsStateSetup } from './setup/state/slots/ucp-desktop-slots-state-setup';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';
import { UcpDesktopIocSetup } from './ucp-desktop-ioc-setup';

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
			() => context.set('state.isMobile', false),
			UcpBaseContextSetup,
			UcpDesktopSlotsContextSetup,
			UcpTargetingSetup,
			UcpDesktopPrebidConfigSetup,
			UcpDesktopA9ConfigSetup,
			UcpDesktopDynamicSlotsSetup,
			UcpDesktopSlotsStateSetup,
			BiddersStateSetup,
			UcpDesktopTemplatesSetup,
			UcpDesktopBillTheLizardSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.dispatch(adEngineConfigured()),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpDesktopAdsMode,
				no: UcpNoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
