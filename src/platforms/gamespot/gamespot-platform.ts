import { Injectable } from '@wikia/dependency-injection';

import {
	bidders,
	communicationService,
	context,
	eventsRepository,
	utils,
	ProcessPipeline,
} from '@wikia/ad-engine';
import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	gptSetup,
	InstantConfigSetup,
} from '@platforms/shared';

import { basicContext } from './ad-context';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotDynamicSlotsSetup } from './setup/dynamic-slots/gamespot-dynamic-slots.setup';
import { GamespotPrebidConfigSetup } from './setup/context/prebid/gamespot-prebid-config.setup';
import { NewsAndRatingsTargetingSetup } from '../shared-news-and-ratings/context/targeting/news-and-ratings-targeting.setup';

@Injectable()
export class GameSpotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			// setup
			() => context.extend(basicContext),
			() => context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441),
			() => context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src')),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			NewsAndRatingsTargetingSetup,
			GamespotSlotsContextSetup,
			GamespotDynamicSlotsSetup,
			BiddersStateSetup,
			GamespotPrebidConfigSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),

			// run
			() =>
				bidders
					.call()
					.then(() => communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY)),
			gptSetup.call,
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
