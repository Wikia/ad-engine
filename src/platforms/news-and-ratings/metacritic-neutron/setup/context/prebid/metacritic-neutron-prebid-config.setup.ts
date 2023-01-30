import {
	Bidders,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getIndexExchangeContext } from '../../../bidders/index-exchange';

@Injectable()
export class MetacriticNeutronPrebidConfigSetup implements DiProcess {
	constructor(private bidders: Bidders) {}

	execute(): void {
		const isDesktop = utils.client.isDesktop();

		if (!this.isPrebidEnabled()) {
			return;
		}

		context.set('bidders.prebid.indexExchange', getIndexExchangeContext(isDesktop));

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
