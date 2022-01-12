import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { AdTags } from '../taxonomy/taxonomy-service.loader';
import { silverSurferServiceLoader } from './silver-surfer.loader';

const logGroup = 'silver-surfer';

class SilverSurferService {
	async configureUserTargeting(): Promise<AdTags> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return {};
		}

		this.setListenerForLazyLoadedSlots();

		return this.setUserProfileTargeting();
	}

	private setListenerForLazyLoadedSlots(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			async () => {
				if (context.get('targeting.galactus_status') !== 'on_time') {
					await this.setUserProfileTargeting();
				}
			},
			false,
		);
	}

	private async setUserProfileTargeting(): Promise<AdTags> {
		const targetingConfig = context.get('services.silverSurfer');
		const userProfile = await silverSurferServiceLoader.getUserProfile();
		const userTargeting = this.mapTargetingResults(targetingConfig, userProfile);

		context.set(`targeting.galactus_status`, userProfile ? 'on_time' : 'too_late');
		Object.keys(userTargeting).forEach((key) => {
			context.set(`targeting.${key}`, userTargeting[key]);
		});

		return userTargeting;
	}

	private mapTargetingResults(targetingConfig: string[] = [], userProfile: UserProfile): AdTags {
		if (!targetingConfig || !targetingConfig.length || !userProfile) {
			return {};
		}

		const splitTargetingConfigKeyVals: AdTags[] = targetingConfig
			.map((keyVal: string) => keyVal.split(':'))
			.map(([configKeyVals, gamKeyVals]) => {
				if (userProfile[configKeyVals]) {
					return {
						[gamKeyVals]: userProfile[configKeyVals],
					};
				}
			});

		return Object.assign({}, ...splitTargetingConfigKeyVals);
	}

	private isEnabled(): boolean {
		return !!context.get('services.silverSurfer');
	}
}

export const silverSurferService = new SilverSurferService();
