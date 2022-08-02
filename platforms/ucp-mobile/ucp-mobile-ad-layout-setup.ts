import { conditional, context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';
import { UcpMobileLighterAdsMode } from './modes/ucp-mobile-lighter-ads.mode';
import { LighterMobileAdsPartnersSetup } from './modes/lighter-mobile-ads-partners-setup.mode';

@Injectable()
export class UcpMobileAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			UcpMobileDynamicSlotsSetup,
			UcpMobileTemplatesSetup,
			conditional(() => context.get('system.ads_initialize_v2'), {
				yes: LighterMobileAdsPartnersSetup,
				no: UcpMobileLighterAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
