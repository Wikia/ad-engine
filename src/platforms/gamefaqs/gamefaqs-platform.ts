import { Injectable } from '@wikia/dependency-injection';

import {
	BaseContextSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';

import { NewsAndRatingsTargetingSetup } from '../shared-news-and-ratings/context/targeting/news-and-ratings-targeting.setup';
import { basicContext } from './ad-context';
import { GamefaqsAdsMode } from './modes/gamefaqs-ads-mode';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsTargetingSetup } from './setup/context/targeting/gamefaqs-targeting.setup';
import { GamefaqsDynamicSlotsSetup } from './setup/dynamic-slots/gamefaqs-dynamic-slots.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441),
			() => context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src')),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			BaseContextSetup,
			NewsAndRatingsTargetingSetup,
			GamefaqsTargetingSetup,
			GamefaqsSlotsContextSetup,
			GamefaqsDynamicSlotsSetup,
			BiddersStateSetup,
			GamefaqsPrebidConfigSetup,
			GamefaqsAdsMode,
		);

		this.pipeline.execute();
	}

	private shouldSwitchGamToRV() {
		return utils.queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return utils.queryString.get('switch_src_to_test') === '1';
	}
}
