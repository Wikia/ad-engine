import {
	Bidders,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getPubmaticContext } from '../../../bidders/pubmatic';
import { getWikiaContext } from '../../../bidders/wikia';

@Injectable()
export class MetacriticPrebidConfigSetup implements DiProcess {
	constructor(private bidders: Bidders) {}

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
				this.bidders.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}

	private isPrebidEnabled() {
		return !!context.get('bidders.prebid');
	}
}
