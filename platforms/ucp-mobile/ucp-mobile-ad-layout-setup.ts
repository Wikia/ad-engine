import { conditional, context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';
import { UcpMobileLighterLegacyAdsMode } from './modes/ucp-mobile-lighter-legacy-ads-mode.service';
import { UcpMobileLighterAdsPartners } from './modes/ucp-mobile-lighter-ads-partners.mode';

@Injectable()
export class UcpMobileAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			UcpMobileDynamicSlotsSetup,
			UcpMobileTemplatesSetup,
			conditional(() => context.get('system.ads_initialize_v2'), {
				yes: UcpMobileLighterAdsPartners,
				no: UcpMobileLighterLegacyAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
