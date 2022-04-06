import {
	AdEngineRunnerSetup,
	AdLayoutInitializerSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
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
import { UcpDesktopBaseContextSetup } from './setup/context/base/ucp-desktop-base-context.setup';
import { UcpDesktopSlotsContextSetup } from './setup/context/slots/ucp-desktop-slots-context.setup';
import { UcpDesktopIocSetup } from './ucp-desktop-ioc-setup';
import { UcpDesktopAdLayoutSetup } from './ucp-desktop-ad-layout-setup';
import { LegacySetup } from './ucp-desktop-legacy-setup';
import { NoAdsSetup } from '../shared/setup/noads.setup';

function shouldUseAdLayouts(): Promise<boolean> {
	return new AdLayoutInitializerSetup()
		.execute()
		.then(() => true)
		.catch(() => false);
}

@Injectable()
export class UcpDesktopPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			UcpDesktopIocSetup,
			WikiContextSetup,
			UcpDesktopBaseContextSetup,
			UcpDesktopSlotsContextSetup,
			NoAdsSetup,
			UcpTargetingSetup,
			conditional(shouldUseAdLayouts, {
				yes: UcpDesktopAdLayoutSetup,
				no: LegacySetup,
			}),
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		this.pipeline.execute();
	}
}
