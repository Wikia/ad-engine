import { BaseServiceSetup, prebidNativeProvider } from '@wikia/ad-engine';

class PrebidNativeProviderSetup extends BaseServiceSetup {
	initialize() {
		prebidNativeProvider.initialize();
		this.setInitialized();
	}
}

export const prebidNativeProviderSetup = new PrebidNativeProviderSetup();
