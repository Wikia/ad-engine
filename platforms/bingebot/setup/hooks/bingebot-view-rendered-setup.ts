import {
	communicationService,
	DiProcess,
	events,
	eventService,
	globalAction,
	ofType,
	onlyNew,
} from '@wikia/ad-engine';
import { props } from 'ts-action';

interface ViewRenderedProps {
	viewType: string;
}

const viewRendered = globalAction('[BingeBot] view rendered', props<ViewRenderedProps>());

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
