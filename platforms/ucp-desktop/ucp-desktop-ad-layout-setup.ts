import { conditional, context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { UcpDesktopSlotsStateSetup } from './setup/state/slots/ucp-desktop-slots-state-setup';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopLighterAdsModeDeprecated } from './modes/ucp-desktop-lighter-ads-mode-deprecated.service';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';
import { UcpDesktopLighterAdsMode } from './modes/ucp-desktop-lighter-ads-mode.service';

@Injectable()
export class UcpDesktopAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			UcpDesktopDynamicSlotsSetup,
			UcpDesktopSlotsStateSetup,
			UcpDesktopTemplatesSetup,
			conditional(() => context.get('options.adsInitializeV2'), {
				yes: UcpDesktopLighterAdsMode,
				no: UcpDesktopLighterAdsModeDeprecated,
			}),
		);

		this.pipeline.execute();
	}
}
