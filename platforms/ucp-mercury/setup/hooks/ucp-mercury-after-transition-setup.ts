import {
	communicationService,
	DiProcess,
	events,
	eventService,
	ofType,
	onlyNew,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { mercuryAfterTransition } from '../../setup-ucp-mercury';
import { UcpMercuryPlatform } from '../../ucp-mercury-platform';
import { MEDIA_WIKI_ADS_CONTEXT } from '../context/wiki/ucp-mercury-wiki-context.setup';

@Injectable()
export class UcpMercuryAfterTransitionSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		communicationService.action$
			.pipe(ofType(mercuryAfterTransition), onlyNew())
			.subscribe(({ payload }: { payload: MediaWikiAdsContext }) => this.afterTransition(payload));
	}

	private afterTransition(adContext: MediaWikiAdsContext): void {
		eventService.emit(events.PAGE_RENDER_EVENT, {
			adContext,
		});

		this.container.bind(MEDIA_WIKI_ADS_CONTEXT).value(adContext);

		const platform = this.container.get(UcpMercuryPlatform);

		platform.execute();
	}
}
