import { BaseServiceSetup, liveConnect } from '@wikia/ad-engine';
class LiveConnectSetup extends BaseServiceSetup {
	initialize() {
		liveConnect.call();
		this.res();
	}
}

export const liveConnectSetup = new LiveConnectSetup();
