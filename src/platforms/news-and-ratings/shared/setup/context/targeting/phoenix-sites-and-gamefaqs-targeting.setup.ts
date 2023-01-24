import { context, DiProcess } from '@wikia/ad-engine';
import { TargetingParams } from './interfaces/targeting-params';

export class PhoenixSitesAndGamefaqsTargetingSetup implements DiProcess {
	execute(): void {
		context.set('targeting', {
			...context.get('targeting'),
			...this.getPageLevelTargeting(),
		});
	}

	getPageLevelTargeting(): TargetingParams {
		const targetParams = this.getMetadataTargetingParams();
		const targeting: TargetingParams = {};

		if (targetParams) {
			for (const [key, value] of Object.entries(targetParams)) {
				if (key === 'cid') {
					targeting['contentid_nr'] = value;
					break;
				}

				if (key === 'con') {
					targeting['pform'] = value;
					break;
				}

				if (key === 'genre') {
					targeting['gnre'] = value;
					break;
				}

				targeting[key] = value;
			}
		}

		return targeting;
	}

	getMetadataTargetingParams(): TargetingParams {
		const dataSettingsElement = document.head
			.querySelector('[id=ad-settings]')
			?.getAttribute('data-settings');

		if (dataSettingsElement) {
			return JSON.parse(dataSettingsElement)?.target_params;
		}

		return null;
	}
}
