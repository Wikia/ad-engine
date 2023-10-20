export class AdEngineStageSetup {
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
