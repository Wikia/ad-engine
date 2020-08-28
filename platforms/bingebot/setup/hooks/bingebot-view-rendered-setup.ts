import {
	communicationService,
	DiProcess,
	events,
	eventService,
	ofType,
	onlyNew,
} from '@wikia/ad-engine';
import { viewRendered } from '../../setup-bingebot';

export class BingeBotViewRenderedSetup implements DiProcess {
	async execute(): Promise<void> {
		communicationService.action$
			.pipe(ofType(viewRendered), onlyNew())
			.subscribe(() => this.emitPageRenderEvent());
	}

	private emitPageRenderEvent(): void {
		eventService.emit(events.PAGE_RENDER_EVENT);
	}
}
