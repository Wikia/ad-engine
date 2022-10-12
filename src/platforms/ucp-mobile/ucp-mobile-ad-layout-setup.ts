import { ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';
import { UcpMobileLighterAds } from './modes/ucp-mobile-lighter-ads-mode.service';

@Injectable()
export class UcpMobileAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(UcpMobileDynamicSlotsSetup, UcpMobileTemplatesSetup, UcpMobileLighterAds);

		this.pipeline.execute();
	}
}
