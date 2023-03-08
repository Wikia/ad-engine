import { ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { UcpIncontentPlayerStateSetup } from '@platforms/shared';
import { UcpDesktopLighterAdsMode } from './modes/ucp-desktop-lighter-ads.mode';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';

@Injectable()
export class UcpDesktopAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			UcpDesktopDynamicSlotsSetup,
			UcpIncontentPlayerStateSetup,
			UcpDesktopTemplatesSetup,
			UcpDesktopLighterAdsMode,
		);

		this.pipeline.execute();
	}
}
