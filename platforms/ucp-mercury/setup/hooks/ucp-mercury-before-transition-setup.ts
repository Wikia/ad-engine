import { NoAdsDetector } from '@platforms/shared';
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
	constructor(private noAdsDetector: NoAdsDetector) {}

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
		this.noAdsDetector.reset();

		eventService.emit(events.BEFORE_PAGE_CHANGE_EVENT);
	}
}
