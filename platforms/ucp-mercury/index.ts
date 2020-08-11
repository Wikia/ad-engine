import {
	communicationService,
	events,
	eventService,
	InstantConfigCacheStorage,
	ofType,
	onlyNew,
	SessionCookie,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import {
	mercuryAfterTransition,
	mercuryBeforeTransition,
	mercuryInit,
	mercuryTransition,
} from './setup-ucp-mercury';
import { MEDIA_WIKI_ADS_CONTEXT } from './setup/context/wiki/ucp-mercury-wiki-context.setup';
import './styles.scss';
import { UcpMercuryPlatform } from './ucp-mercury-platform';

function beforeTransition(): void {
	const cacheStorage = InstantConfigCacheStorage.make();
	const sessionCookie = SessionCookie.make();

	cacheStorage.resetCache();
	sessionCookie.readSessionId();

	eventService.emit(events.BEFORE_PAGE_CHANGE_EVENT);
}

function onTransition(): void {
	eventService.emit(events.PAGE_CHANGE_EVENT);
}

function afterTransition({ payload }: { payload: MediaWikiAdsContext }): void {
	// TODO:
	// window.__uspapi('showConsentTool', true);

	eventService.emit(events.PAGE_RENDER_EVENT, {
		adContext: payload,
	});

	const container = new Container();
	container.bind(MEDIA_WIKI_ADS_CONTEXT).value(payload);

	const platform = container.get(UcpMercuryPlatform);

	platform.execute();
}

function load({ payload }: { payload: MediaWikiAdsContext }): void {
	const container = new Container();
	container.bind(MEDIA_WIKI_ADS_CONTEXT).value(payload);

	const platform = container.get(UcpMercuryPlatform);

	platform.execute();

	communicationService.action$
		.pipe(ofType(mercuryBeforeTransition), onlyNew())
		.subscribe(beforeTransition);
	communicationService.action$.pipe(ofType(mercuryTransition), onlyNew()).subscribe(onTransition);
	communicationService.action$
		.pipe(ofType(mercuryAfterTransition), onlyNew())
		.subscribe(afterTransition);
}

communicationService.action$.pipe(ofType(mercuryInit), take(1)).subscribe(load);
