import { ProcessPipeline } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

import { UcpIncontentPlayerStateSetup } from '@platforms/shared';
import { UcpDesktopLighterAdsMode } from './modes/ucp-desktop-lighter-ads-mode.service';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';

@injectable()
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
