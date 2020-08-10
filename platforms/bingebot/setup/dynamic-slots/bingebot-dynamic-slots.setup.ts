import { DynamicSlotsSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';
// tslint:disable-next-line:import-blacklist
import { Communicator } from '@wikia/post-quecast';

@Injectable()
export class BingeBotDynamicSlotsSetup implements DynamicSlotsSetup {
	execute(): void {
		this.injectSponsoredLogo();
	}

	private injectSponsoredLogo(): void {
		const sponsoredLogo = document.createElement('div');
		sponsoredLogo.id = 'sponsored_logo';

		const communicator = new Communicator();
		communicator.dispatch({ type: '[AdEngine] inject sponsored logo', slotId: 'sponsored_logo' });
	}
}
