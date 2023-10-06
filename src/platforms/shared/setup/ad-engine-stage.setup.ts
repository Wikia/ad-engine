import { BaseServiceSetup } from '@wikia/ad-engine';

export class AdEngineStageSetup extends BaseServiceSetup {
	async afterDocumentCompleted(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (document.readyState === 'complete') {
				resolve();
			} else {
				reject();
			}
		});
	}
}
