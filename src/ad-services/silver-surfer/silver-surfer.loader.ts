import { utils } from '@ad-engine/core';

const logGroup = 'silver-surfer';

class SilverSurferServiceLoader {
	userProfilePromise: Promise<UserProfile> = null;

	async getUserProfile(): Promise<UserProfile> {
		if (
			window.SilverSurferSDK &&
			window.SilverSurferSDK.isInitialized() &&
			!this.userProfilePromise
		) {
			this.userProfilePromise = this.fetchUserProfile();
		}

		return this.userProfilePromise;
	}

	private async fetchUserProfile(): Promise<UserProfile> {
		return window.SilverSurferSDK.getUserProfile()
			.then(
				(response: UserProfile) => {
					if (response && typeof response === 'object' && Object.keys(response).length !== 0) {
						utils.logger(logGroup, 'successful response');

						return response;
					}

					return {};
				},
				() => {
					utils.logger(logGroup, 'rejected');

					return {};
				},
			)
			.then((userProfile: UserProfile) => {
				utils.logger(logGroup, 'user profile fetched', userProfile);

				return userProfile;
			});
	}
}

export const silverSurferServiceLoader = new SilverSurferServiceLoader();
