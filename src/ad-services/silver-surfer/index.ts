import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';
import { AdTags } from '../taxonomy/taxonomy-service.loader';
import { silverSurferServiceLoader } from './silver-surfer.loader';

const logGroup = 'silver-surfer';
const adSlotLoadedEvent = globalAction(
	'[AdEngine] Ad Slot added',
	props<{ name: string; status: string }>(),
);

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
		communicationService.action$.pipe(ofType(adSlotLoadedEvent)).subscribe(async () => {
			if (context.get('targeting.galactus_status') !== 'on_time') {
				await this.setUserProfileTargeting();
			}
		});
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
