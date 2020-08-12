import {
	communicationService,
	DiProcess,
	events,
	eventService,
	InstantConfigCacheStorage,
	ofType,
	onlyNew,
	SessionCookie,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { mercuryBeforeTransition } from '../../setup-ucp-mercury';

@Injectable()
export class UcpMercuryBeforeTransitionSetup implements DiProcess {
	async execute(): Promise<void> {
		communicationService.action$
			.pipe(ofType(mercuryBeforeTransition), onlyNew())
			.subscribe(() => this.beforeTransition());
	}

	private beforeTransition(): void {
		const cacheStorage = InstantConfigCacheStorage.make();
		const sessionCookie = SessionCookie.make();

		cacheStorage.resetCache();
		sessionCookie.readSessionId();

		eventService.emit(events.BEFORE_PAGE_CHANGE_EVENT);
	}
}
