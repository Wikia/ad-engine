import { communicationService, ofType } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import { mercuryInit } from './setup-ucp-mercury';
import { MEDIA_WIKI_ADS_CONTEXT } from './setup/context/wiki/ucp-mercury-wiki-context.setup';
import './styles.scss';
import { UcpMercuryPlatform } from './ucp-mercury-platform';

function load({ payload }: { payload: MediaWikiAdsContext }): void {
	const container = new Container();
	container.bind(MEDIA_WIKI_ADS_CONTEXT).value(payload);

	const platform = container.get(UcpMercuryPlatform);

	platform.setup();
	platform.execute();
}

communicationService.action$.pipe(ofType(mercuryInit), take(1)).subscribe(load);
