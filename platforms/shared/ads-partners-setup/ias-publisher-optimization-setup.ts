import { BaseServiceSetup, iasPublisherOptimization } from '@wikia/ad-engine';

class IasPublisherOptimizationSetup extends BaseServiceSetup {
	async initialize(): Promise<void> {
		await iasPublisherOptimization.call();
		this.setInitialized();
	}
}

export const iasPublisherOptimizationSetup = new IasPublisherOptimizationSetup();
