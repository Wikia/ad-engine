import { context, utils } from '@ad-engine/core';
import { UserProfile } from '../../../@types/silver-surfer';
import { AdTags } from '../taxonomy/taxonomy-service.loader';
import { silverSurferServiceLoader } from './silver-surfer.loader';

const logGroup = 'silver-surfer';

class SilverSurferService {
	async configureUserTargeting(): Promise<AdTags> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return {};
		}
		// @ts-ignore
		const targetingConfig = context.get('services.silverSurfer');
		const userProfile: UserProfile = await silverSurferServiceLoader.getUserProfile();

		return this.mapTargetingResults(targetingConfig, userProfile);
	}

	private mapTargetingResults(targetingConfig: string[] = [], userProfile = {}): AdTags {
		if (!targetingConfig || !targetingConfig.length) {
			return {};
		}

		const splitTargetingConfigKeyVals: string[][] = targetingConfig
			.map((keyVal: string) => keyVal.split(':'))

		const [configKeyVals, gamKeyVals] = this.partitionTargetingKeyValsArrays(splitTargetingConfigKeyVals);

		console.log({ targetingConfig, userProfile, configKeyVals, gamKeyVals });
		}

	private isEnabled(): boolean {
		return !!context.get('services.silverSurfer');
	}

	private partitionTargetingKeyValsArrays(config: string[][]): string[][] {
		const configKeyVals = [];
		const gamKeyVals = [];
		config.forEach(([a, b]) => {
			configKeyVals.push(a)
			gamKeyVals.push(b)
		});
		return [configKeyVals, gamKeyVals];
	}
}

export const silverSurferService = new SilverSurferService();
