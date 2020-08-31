import { communicationService, DiProcess, ofType, onlyNew } from '@wikia/ad-engine';
import { destroyAdSlot } from '../../setup-bingebot';

export class BingeBotBeforeViewRenderedSetup implements DiProcess {
	async execute(): Promise<void> {
		communicationService.action$
			.pipe(ofType(destroyAdSlot), onlyNew())
			.subscribe(() => this.updateCorrelator());
	}

	private updateCorrelator(): void {
		window.googletag.pubads().updateCorrelator();
	}
}
