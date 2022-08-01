import { audigent, BaseServiceSetup } from '@wikia/ad-engine';

class AudigentSetup extends BaseServiceSetup {
	async initialize(): Promise<void> {
		await audigent.call();
		this.res();
	}
}

export const audigentSetup = new AudigentSetup();
