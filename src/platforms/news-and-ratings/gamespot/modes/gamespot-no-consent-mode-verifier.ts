import { communicationService, DiProcess, eventsRepository } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NewsAndRatingsPageDataGetter } from '../../shared';

@Injectable()
export class GamespotNoConsentModeVerifier implements DiProcess {
	constructor(protected newsAndRatingsPageDataGetter: NewsAndRatingsPageDataGetter) {}

	execute(): void {
		if (this.appEmbeddedOnFacebook() || this.videoEmbeddedOnThePage()) {
			this.emitAdEngineNoConsentModeEvent();
		}
	}

	appEmbeddedOnFacebook() {
		const dataSettings = this.newsAndRatingsPageDataGetter.getDataSettingsFromMetaTag();

		return dataSettings?.target_params?.partner === 'fb_instant';
	}

	videoEmbeddedOnThePage() {
		const videoWrapper = document.querySelector('div[data-embed-type="video"]');

		return videoWrapper && window.utag_data?.pageType !== 'video_embed';
	}

	emitAdEngineNoConsentModeEvent() {
		communicationService.emit(eventsRepository.AD_ENGINE_NO_CONSENT_MODE);
	}
}
