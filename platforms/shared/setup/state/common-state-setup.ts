import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { StateSetup } from './_state.setup';
import { BiddersStateSetup } from './bidders/_bidders-state.setup';
import { SlotsStateSetup } from './slots/_slots-state.setup';

@Injectable()
export class CommonStateSetup implements StateSetup {
	constructor(
		private slotsStateSetup: SlotsStateSetup,
		private biddersStateSetup: BiddersStateSetup,
	) {}

	configureState(isMobile = false): void {
		this.setBaseState(isMobile);
		this.slotsStateSetup.configureSlotsState();
		this.biddersStateSetup.configureBiddersState();
	}

	private setBaseState(isMobile: boolean): void {
		context.set('state.isMobile', isMobile);
		context.set('state.showAds', !utils.client.isSteamPlatform());
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));
	}
}
