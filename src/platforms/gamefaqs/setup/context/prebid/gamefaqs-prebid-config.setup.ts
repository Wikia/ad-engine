import {
	bidders,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getAppnexusContext } from '../../../bidders/appnexus';
import { getWikiaContext } from '../../../bidders/wikia';

@Injectable()
export class GamefaqsPrebidConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.prebid.appnexus', getAppnexusContext());
		context.set('bidders.prebid.wikia', getWikiaContext());

		context.set('bidders.enabled', true);
		context.set('bidders.prebid.enabled', true);
		context.set(
			'bidders.prebid.libraryUrl',
			'//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/v6.9.0/20221115.min.js',
		);

		context.set('bidders.prebid.appnexus.enabled', true);
		context.set('bidders.prebid.appnexus.wikia', true);

		this.registerListeners();
	}

	private registerListeners() {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				bidders.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}
}
