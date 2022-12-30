import { Injectable } from '@wikia/dependency-injection';

import {
	BaseContextSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';

import { basicContext } from './ad-context';

import { NewsAndRatingsTargetingSetup } from '../shared-news-and-ratings/context/targeting/news-and-ratings-targeting.setup';
import { ComicvineAdsMode } from './modes/comicvine-ads-mode';
import { ComicvinePrebidConfigSetup } from './setup/context/prebid/comicvine-prebid-config.setup';
import { ComicvineSlotsContextSetup } from './setup/context/slots/comicvine-slots-context.setup';
import { ComicvineDynamicSlotsSetup } from './setup/dynamic-slots/comicvine-dynamic-slots.setup';

@Injectable()
export class ComicvinePlatform {
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
			ComicvineDynamicSlotsSetup,
			ComicvineSlotsContextSetup,
			BiddersStateSetup,
			ComicvinePrebidConfigSetup,
			ComicvineAdsMode,
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
