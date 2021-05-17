import { context, utils } from '@ad-engine/core';
import { UserProfile } from '../../../@types/silver-surfer';
import { AdTags } from '../taxonomy/taxonomy-service.loader';
import { silverSurferServiceLoader } from './silver-surfer.loader';

const logGroup = 'silver-surfer';

class SilverSurferService {
	private static isEnabled(): boolean {
		return !!context.get('services.silverSurfer');
	}

	private static convertArrayToObject(array: []): {} {
		return Object.assign({}, ...array);
	}

	async configureUserTargeting(): Promise<AdTags> {
		if (!SilverSurferService.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return {};
		}

		const targetingConfig = context.get('services.silverSurfer');
		const userProfile: UserProfile = await silverSurferServiceLoader.getUserProfile();

		const userTargeting = this.mapTargetingResults(targetingConfig, userProfile);

		Object.keys(userTargeting).forEach((key) => {
			context.set(`targeting.${key}`, userTargeting[key]);
		});
		return userTargeting;
	}

	private mapTargetingResults(targetingConfig: string[] = [], userProfile: UserProfile): AdTags {
		if (!targetingConfig || !targetingConfig.length) {
			return {};
		}

		const splitTargetingConfigKeyVals: any = targetingConfig
			.map((keyVal: string) => keyVal.split(':'))
			.map(([configKeyVals, gamKeyVals]) => ({
				[gamKeyVals]: userProfile[configKeyVals],
			}));

		return SilverSurferService.convertArrayToObject(splitTargetingConfigKeyVals);
	}
}

export const silverSurferService = new SilverSurferService();
