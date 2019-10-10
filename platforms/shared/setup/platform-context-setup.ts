import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class PlatformContextSetup {
	constructor() {}

	setStateContext(isMobile: boolean): void {
		context.set('state.isMobile', isMobile);
		context.set('state.showAds', !utils.client.isSteamPlatform());
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));
	}
}
