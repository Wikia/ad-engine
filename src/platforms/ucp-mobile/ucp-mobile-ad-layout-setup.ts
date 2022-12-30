import { ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileLighterAds } from './modes/ucp-mobile-lighter-ads-mode.service';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';

@Injectable()
export class UcpMobileAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(UcpMobileDynamicSlotsSetup, UcpMobileTemplatesSetup, UcpMobileLighterAds);

		this.pipeline.execute();
	}
}
