import {
	Bidders,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getCriteoContext } from '../../../bidders/criteo';
import { getIndexExchangeContext } from '../../../bidders/index-exchange';

@Injectable()
export class MetacriticNeutronPrebidConfigSetup implements DiProcess {
	constructor(private bidders: Bidders) {}

	execute(): void {
		if (!this.isPrebidEnabled()) {
			return;
		}

		const isDesktop = !context.get('state.isMobile');

		context.set('bidders.prebid.criteo', getCriteoContext(isDesktop));
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
