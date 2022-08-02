import { conditional, context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { UcpDesktopSlotsStateSetup } from './setup/state/slots/ucp-desktop-slots-state-setup';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopLighterLegacyAdsMode } from './modes/ucp-desktop-lighter-legacy-ads-mode.service';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';
import { UcpDesktopLighterAdsPartnersMode } from './modes/ucp-desktop-lighter-ads-partners.mode';

@Injectable()
export class UcpDesktopAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			UcpDesktopDynamicSlotsSetup,
			UcpDesktopSlotsStateSetup,
			UcpDesktopTemplatesSetup,
			conditional(() => context.get('system.ads_initialize_v2'), {
				yes: UcpDesktopLighterAdsPartnersMode,
				no: UcpDesktopLighterLegacyAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
