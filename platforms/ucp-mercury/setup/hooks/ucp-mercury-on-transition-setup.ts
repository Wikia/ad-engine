import {
	communicationService,
	DiProcess,
	events,
	eventService,
	ofType,
	onlyNew,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { mercuryTransition } from '../../setup-ucp-mercury';

@Injectable()
export class UcpMercuryOnTransitionSetup implements DiProcess {
	async execute(): Promise<void> {
		communicationService.action$
			.pipe(ofType(mercuryTransition), onlyNew())
			.subscribe(() => this.onTransition());
	}

	private onTransition(): void {
		eventService.emit(events.PAGE_CHANGE_EVENT);
	}
}
