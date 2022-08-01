import { BaseServiceSetup, prebidNativeProvider } from '@wikia/ad-engine';

class PrebidNativeProviderSetup extends BaseServiceSetup {
	initialize() {
		prebidNativeProvider.initialize();
		this.res();
	}
}

export const prebidNativeProviderSetup = new PrebidNativeProviderSetup();
