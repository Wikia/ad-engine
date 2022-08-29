import { AdEngine, PartnerServiceStage, Service } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

@Service({
	stage: PartnerServiceStage.provider,
})
class AdEngineSetup {
	call() {
		adEngineInstance = new AdEngine();
		adEngineInstance.init();
	}
}

export const adEngineSetup = new AdEngineSetup();
