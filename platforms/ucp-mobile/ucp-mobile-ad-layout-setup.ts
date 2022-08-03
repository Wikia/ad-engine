import { conditional, context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';
import { UcpMobileLighterLegacyAdsMode } from './modes/ucp-mobile-lighter-ads-mode-deprecated.service';
import { UcpMobileLighterAds } from './modes/ucp-mobile-lighter-ads-mode.service';

@Injectable()
export class UcpMobileAdLayoutSetup {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			UcpMobileDynamicSlotsSetup,
			UcpMobileTemplatesSetup,
			conditional(() => context.get('options.adsInitializeV2'), {
				yes: UcpMobileLighterAds,
				no: UcpMobileLighterLegacyAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
