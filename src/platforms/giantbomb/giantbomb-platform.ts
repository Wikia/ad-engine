import { Injectable } from '@wikia/dependency-injection';

import {
	communicationService,
	context,
	eventsRepository,
	utils,
	ProcessPipeline,
} from '@wikia/ad-engine';
import {
	BaseContextSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
} from '@platforms/shared';

import { basicContext } from './ad-context';
import { GiantbombSlotsContextSetup } from './setup/context/slots/giantbomb-slots-context.setup';
import { GiantbombDynamicSlotsSetup } from './setup/dynamic-slots/giantbomb-dynamic-slots.setup';
import { NewsAndRatingsTargetingSetup } from '../shared-news-and-ratings/context/targeting/news-and-ratings-targeting.setup';
import { GiantbombAdsMode } from './modes/giantbomb-ads-mode.service';

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
			BiddersStateSetup,
			GiantbombDynamicSlotsSetup,
			GiantbombAdsMode,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
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
