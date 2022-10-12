import { AdEngine, Service, ServiceStage } from '@wikia/ad-engine';

@Service({
	stage: ServiceStage.provider,
})
class AdEngineSetup {
	adEngineInstance: AdEngine;

	call() {
		this.adEngineInstance = new AdEngine();
		this.adEngineInstance.init();
	}
}

export const adEngineSetup = new AdEngineSetup();
