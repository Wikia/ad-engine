import { Injectable } from '@wikia/dependency-injection';
import { conditional, ProcessPipeline } from '@wikia/ad-engine';
import {
	BiddersStateSetup,
	NoAdsDetector,
	NoAdsMode,
	SequentialMessagingSetup,
} from '@platforms/shared';
import { UcpMobilePrebidConfigSetup } from './setup/context/prebid/ucp-mobile-prebid-config.setup';
import { UcpMobileA9ConfigSetup } from './setup/context/a9/ucp-mobile-a9-config.setup';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';
import { UcpMobileAdsMode } from './modes/ucp-mobile-ads.mode';

@Injectable()
export class UcpMobileLegacySetup {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		this.pipeline.add(
			UcpMobilePrebidConfigSetup,
			UcpMobileA9ConfigSetup,
			UcpMobileDynamicSlotsSetup,
			UcpMobileTemplatesSetup,
			SequentialMessagingSetup, // SequentialMessagingSetup needs to be after *TemplatesSetup or UAP SM will break
			BiddersStateSetup,
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpMobileAdsMode,
				no: NoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
