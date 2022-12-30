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
import { GiantbombAdsMode } from './modes/giantbomb-ads-mode';
import { GiantbombPrebidConfigSetup } from './setup/context/prebid/giantbomb-prebid-config.setup';
import { GiantbombSlotsContextSetup } from './setup/context/slots/giantbomb-slots-context.setup';
import { GiantbombDynamicSlotsSetup } from './setup/dynamic-slots/giantbomb-dynamic-slots.setup';

@Injectable()
export class GiantbombPlatform {
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
			GiantbombSlotsContextSetup,
			GiantbombDynamicSlotsSetup,
			BiddersStateSetup,
			GiantbombPrebidConfigSetup,
			GiantbombAdsMode,
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
