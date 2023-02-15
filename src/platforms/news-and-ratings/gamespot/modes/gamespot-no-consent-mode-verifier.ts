import { communicationService, DiProcess, eventsRepository } from '@wikia/ad-engine';
import { NewsAndRatingsPageDataGetter } from '../../shared';

export class GamespotNoConsentModeVerifier implements DiProcess {
	constructor(protected metadataGetter: NewsAndRatingsPageDataGetter) {}

	execute(): void {
		if (this.appEmbeddedOnFacebook()) {
			communicationService.emit(eventsRepository.AD_ENGINE_NO_CONSENT_MODE);
		}
	}

	appEmbeddedOnFacebook() {
		const dataSettings = this.metadataGetter.getDataSettingsFromMetaTag();

		return dataSettings?.target_params?.partner === 'fb_instant';
	}
}
