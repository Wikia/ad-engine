import {
	bidders,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getAppnexusContext } from '../../../bidders/appnexus';
import { getWikiaContext } from '../../../bidders/wikia';
import { getPubmaticContext } from '../../../bidders/pubmatic';
import { getRubiconDisplayContext } from '../../../bidders/rubicon-display';

@Injectable()
export class ComicvinePrebidConfigSetup implements DiProcess {
	execute(): void {
		const isDesktop = utils.client.isDesktop();

		if (!this.isPrebidEnabled()) {
			return;
		}

		context.set('bidders.prebid.appnexus', getAppnexusContext(isDesktop));
		context.set('bidders.prebid.pubmatic', getPubmaticContext(isDesktop));
		context.set('bidders.prebid.rubicon_display', getRubiconDisplayContext(isDesktop));
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
