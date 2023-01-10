import {
	bidders,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getWikiaContext } from '../../../bidders/wikia';
import { getPubmaticContext } from '../../../bidders/pubmatic';

@Injectable()
export class ComicvinePrebidConfigSetup implements DiProcess {
	execute(): void {
		if (!this.isPrebidEnabled()) {
			return;
		}

		context.set('bidders.prebid.pubmatic', getPubmaticContext(utils.client.isDesktop()));
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
