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
import { UcpDesktopAdsMode } from './modes/ucp-desktop-ads.mode';
import { AdsPartnersSetup } from './modes/ads-partners-setup.mode';

@Injectable()
export class UcpDesktopLegacySetup {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		if (context.get('system.ads_initialize_v2')) {
			console.time('DJ:init');
		} else {
			console.time('DJ:legacy init');
		}
		this.pipeline.add(
			UcpDesktopPrebidConfigSetup,
			UcpDesktopA9ConfigSetup,
			UcpDesktopDynamicSlotsSetup,
			UcpDesktopSlotsStateSetup,
			BiddersStateSetup,
			UcpDesktopTemplatesSetup,
			SequentialMessagingSetup, // SequentialMessagingSetup needs to be after *TemplatesSetup or UAP SM might break
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: conditional(() => context.get('system.ads_initialize_v2'), {
					yes: AdsPartnersSetup,
					no: UcpDesktopAdsMode,
				}),
				no: NoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
