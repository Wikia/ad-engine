import { BaseServiceSetup, liveConnect } from '@wikia/ad-engine';
class LiveConnectSetup extends BaseServiceSetup {
	initialize() {
		liveConnect.call();
		this.setInitialized();
	}
}

export const liveConnectSetup = new LiveConnectSetup();
