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
import { getIndexExchangeContext } from '../../../bidders/index-exchange';
import { getRubiconDisplayContext } from '../../../bidders/rubicon-display';
import { getMedianetContext } from '../../../bidders/medianet';

@Injectable()
export class GamefaqsPrebidConfigSetup implements DiProcess {
	execute(): void {
		if (!this.isPrebidEnabled()) {
			return;
		}

		context.set('bidders.prebid.appnexus', getAppnexusContext());
		context.set('bidders.prebid.indexExchange', getIndexExchangeContext());
		context.set('bidders.prebid.medianet', getMedianetContext());
		context.set('bidders.prebid.rubicon_display', getRubiconDisplayContext());
		context.set('bidders.prebid.wikia', getWikiaContext());

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

	private isPrebidEnabled() {
		return !!context.get('bidders.prebid');
	}
}
