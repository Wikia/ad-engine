import { UcpIncontentPlayerStateSetup } from '@platforms/shared';
import { ProcessPipeline } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { UcpMobileLighterAds } from './modes/ucp-mobile-lighter-ads-mode.service';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';

@injectable()
export class UcpMobileAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			UcpMobileDynamicSlotsSetup,
			UcpIncontentPlayerStateSetup,
			UcpMobileTemplatesSetup,
			UcpMobileLighterAds,
		);

		this.pipeline.execute();
	}
}
