import { communicationService, DiProcess, eventsRepository } from '@wikia/ad-engine';
import { getDataSettingsFromMetaTag } from '../../shared';

export class GamespotNoConsentModeVerifier implements DiProcess {
	execute(): void {
		if (this.appEmbeddedOnFacebook()) {
			communicationService.emit(eventsRepository.AD_ENGINE_NO_CONSENT_MODE);
		}
	}

	appEmbeddedOnFacebook() {
		const dataSettings = getDataSettingsFromMetaTag();

		return dataSettings?.target_params?.partner === 'fb_instant';
	}
}
