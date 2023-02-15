import { communicationService, DiProcess, eventsRepository } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NewsAndRatingsPageDataGetter } from '../../shared';

@Injectable()
export class GamespotNoConsentModeVerifier implements DiProcess {
	constructor(protected newsAndRatingsPageDataGetter: NewsAndRatingsPageDataGetter) {}

	execute(): void {
		if (this.appEmbeddedOnFacebook()) {
			communicationService.emit(eventsRepository.AD_ENGINE_NO_CONSENT_MODE);
		}
	}

	appEmbeddedOnFacebook() {
		const dataSettings = this.newsAndRatingsPageDataGetter.getDataSettingsFromMetaTag();

		return dataSettings?.target_params?.partner === 'fb_instant';
	}
}
