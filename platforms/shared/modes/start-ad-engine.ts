import { AdEngine, AdSlot, communicationService, PipelineProcess, utils } from '@wikia/ad-engine';

let adEngineInstance: AdEngine;

export class AdEngineStarter implements PipelineProcess {
	private readonly inhibitors: Promise<void>[];

	constructor(...inhibitorProcesses: PipelineProcess[]) {
		this.inhibitors = inhibitorProcesses.map((process) => process.execute());
	}

	execute(): Promise<void> {
		startAdEngine(this.inhibitors);
		return Promise.resolve();
	}
}

export function startAdEngine(inhibitors: Promise<any>[] = []): void {
	if (!adEngineInstance) {
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

		adEngineInstance = new AdEngine();
		adEngineInstance.init(inhibitors);

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.removeClass('default-height');
		});
	} else {
		adEngineInstance.runAdQueue(inhibitors);
	}
}
