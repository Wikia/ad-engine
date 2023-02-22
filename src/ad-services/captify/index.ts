import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'captify';

export class Captify extends BaseServiceSetup {
	private propertyId = 12974;

	async call(): Promise<void> {
		if (!this.isEnabled('icCaptify')) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		this.overwritePropertyIdIfPresent();

		this.createCaptifyWindowObject();

		this.createAndInsertScript();

		return Promise.resolve();
	}

	private overwritePropertyIdIfPresent() {
		const contextPropertyId = context.get('services.confiant.propertyId');

		this.propertyId = contextPropertyId ? contextPropertyId : this.propertyId;
	}

	private createCaptifyWindowObject() {
		window[`captify_kw_query_${this.propertyId}`] = '';
	}

	private createAndInsertScript(): void {
		const captifyPixelUrl = `https://p.cpx.to/p/${this.propertyId}/px.js`;

		const section = document.getElementsByTagName('script')[0];
		const elem = utils.scriptLoader.createScript(captifyPixelUrl, 'text/javascript', true, section);

		elem.onload = () => {
			communicationService.emit(eventsRepository.CAPTIFY_LOADED);
			utils.logger(logGroup, 'loaded');
		};
	}
}
