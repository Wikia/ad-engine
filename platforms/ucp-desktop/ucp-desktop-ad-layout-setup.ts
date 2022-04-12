import { exCo, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { UcpDesktopSlotsStateSetup } from './setup/state/slots/ucp-desktop-slots-state-setup';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopLighterAdsMode } from './modes/ucp-desktop-lighter-ads.mode';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';

@Injectable()
export class UcpDesktopAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			UcpDesktopDynamicSlotsSetup,
			UcpDesktopSlotsStateSetup,
			UcpDesktopTemplatesSetup,
			UcpDesktopLighterAdsMode,
		);

		this.pipeline.execute();
		exCo.call();
	}
}
