import { AdEngine, PartnerServiceStage, Service, userIdentity } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

@Service({
	stage: PartnerServiceStage.provider,
	dependencies: [userIdentity],
})
class AdEngineSetup {
	call() {
		adEngineInstance = new AdEngine();
		adEngineInstance.init();
	}
}

export const adEngineSetup = new AdEngineSetup();
