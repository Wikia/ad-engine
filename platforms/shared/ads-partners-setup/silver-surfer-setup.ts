import {
	BaseServiceSetup,
	communicationService,
	context,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
// eslint-disable-next-line no-restricted-imports
import { SilverSurferProfileExtender } from '../../../src/ad-services/silver-surfer/silver-surfer-profile-extender';
// eslint-disable-next-line no-restricted-imports
import { SilverSurferProfileFetcher } from '../../../src/ad-services/silver-surfer/silver-surfer-profile-fetcher';
const logGroup = 'silver-surfer';

class SilverSurferSetup extends BaseServiceSetup {
	constructor(
		private profileFetcher: SilverSurferProfileFetcher,
		private profileExtender: SilverSurferProfileExtender,
	) {
		super();
	}

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
		const userProfile = await this.profileFetcher.getUserProfile();
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
		userProfile = this.profileExtender.extend(userProfile);
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

	initialize() {
		this.configureUserTargeting().then(() => {
			this.res();
		});
	}
}

export const silverSurferSetup = new SilverSurferSetup(
	new SilverSurferProfileFetcher(),
	new SilverSurferProfileExtender(),
);
