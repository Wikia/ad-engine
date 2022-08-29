import { AdEngine, ServiceStage, Service } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

@Service({
	stage: ServiceStage.provider,
})
class AdEngineSetup {
	call() {
		adEngineInstance = new AdEngine();
		adEngineInstance.init();
	}
}

export const adEngineSetup = new AdEngineSetup();
