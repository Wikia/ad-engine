import { context, DiProcess, utils } from '@wikia/ad-engine';
import { TargetingParams } from './interfaces/targeting-params';

export class PhoenixBasedSitesTargetingSetup implements DiProcess {
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
					continue;
				}

				if (key === 'con') {
					targeting['pform'] = value;
					continue;
				}

				if (key === 'genre') {
					targeting['gnre'] = value;
					continue;
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

		if (!dataSettingsElement) {
			return;
		}

		try {
			return JSON.parse(dataSettingsElement).target_params;
		} catch (e) {
			utils.logger(
				'Targeting',
				'Getting targeting params from "ad-settings" metadata object failed',
			);
			return;
		}
	}
}
