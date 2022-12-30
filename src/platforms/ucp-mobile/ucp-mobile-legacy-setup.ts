import {
	BiddersStateSetup,
	NoAdsDetector,
	NoAdsMode,
	SequentialMessagingSetup,
} from '@platforms/shared';
import { conditional, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileAdsMode } from './modes/ucp-mobile-ads-mode.service';
import { UcpMobileA9ConfigSetup } from './setup/context/a9/ucp-mobile-a9-config.setup';
import { UcpMobilePrebidConfigSetup } from './setup/context/prebid/ucp-mobile-prebid-config.setup';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';

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
