import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, scriptLoader } from '@ad-engine/utils';

const logGroup = 'captify';

export class Captify extends BaseServiceSetup {
	private propertyId = 12974;

	async call(): Promise<void> {
		if (!this.isEnabled('icCaptify')) {
			logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		this.overwritePropertyIdIfPresent();

		this.createCaptifyWindowObject();

		this.createAndInsertScript();

		return Promise.resolve();
	}

	private overwritePropertyIdIfPresent() {
		const contextPropertyId = context.get('services.captify.propertyId');

		this.propertyId = contextPropertyId ? contextPropertyId : this.propertyId;
	}

	private createCaptifyWindowObject() {
		window[`captify_kw_query_${this.propertyId}`] = '';
	}

	private createAndInsertScript(): void {
		const captifyPixelUrl = `https://p.cpx.to/p/${this.propertyId}/px.js`;

		const section = document.getElementsByTagName('script')[0];
		const elem = scriptLoader.createScript(captifyPixelUrl, false, section);

		elem.onload = () => {
			communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
				status: 'captify_loaded',
			});
			logger(logGroup, 'loaded');
		};
	}
}
