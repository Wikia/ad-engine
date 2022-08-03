import { ProcessPipeline, conditional, context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	BiddersStateSetup,
	NoAdsDetector,
	NoAdsMode,
	SequentialMessagingSetup,
} from '@platforms/shared';
import { UcpDesktopA9ConfigSetup } from './setup/context/a9/ucp-desktop-a9-config.setup';
import { UcpDesktopPrebidConfigSetup } from './setup/context/prebid/ucp-desktop-prebid-config.setup';
import { UcpDesktopDynamicSlotsSetup } from './setup/dynamic-slots/ucp-desktop-dynamic-slots.setup';
import { UcpDesktopTemplatesSetup } from './templates/ucp-desktop-templates.setup';
import { UcpDesktopSlotsStateSetup } from './setup/state/slots/ucp-desktop-slots-state-setup';
import { UcpDesktopAdsModeDeprecated } from './modes/ucp-desktop-ads-mode-deprecated.service';
import { UcpDesktopAdsMode } from './modes/ucp-desktop-ads-mode.service';

@Injectable()
export class UcpDesktopLegacySetup {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		this.pipeline.add(
			UcpDesktopPrebidConfigSetup,
			UcpDesktopA9ConfigSetup,
			UcpDesktopDynamicSlotsSetup,
			UcpDesktopSlotsStateSetup,
			BiddersStateSetup,
			UcpDesktopTemplatesSetup,
			SequentialMessagingSetup, // SequentialMessagingSetup needs to be after *TemplatesSetup or UAP SM might break
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: conditional(() => context.get('options.adsInitializeV2'), {
					yes: UcpDesktopAdsMode,
					no: UcpDesktopAdsModeDeprecated,
				}),
				no: NoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
