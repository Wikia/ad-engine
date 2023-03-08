import {
	BiddersStateSetup,
	NoAdsDetector,
	NoAdsMode,
	SequentialMessagingSetup,
	UcpIncontentPlayerStateSetup,
} from '@platforms/shared';
import { conditional, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpDesktopAdsMode } from './modes/ucp-desktop-ads.mode';
import { UcpDesktopA9ConfigSetup } from './setup/context/a9/ucp-desktop-a9-config.setup';
import { UcpDesktopPrebidConfigSetup } from './setup/context/prebid/ucp-desktop-prebid-config.setup';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';

@Injectable()
export class UcpDesktopLegacySetup {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		this.pipeline.add(
			UcpDesktopPrebidConfigSetup,
			UcpDesktopA9ConfigSetup,
			UcpDesktopDynamicSlotsSetup,
			UcpIncontentPlayerStateSetup,
			UcpDesktopTemplatesSetup,
			SequentialMessagingSetup, // SequentialMessagingSetup needs to be after *TemplatesSetup or UAP SM might break
			BiddersStateSetup,
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpDesktopAdsMode,
				no: NoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
