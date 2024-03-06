import { context, utils } from '@ad-engine/core';
import { UserIdConfig } from '../index';

const logGroup = 'LiveIntentConnectedId';

export class ConnectedId {
	private publisherIds = {
		gamefaqs: '79973',
		gamespot: '79973',
		comicvine: '79973',
		f2: '79968',
		'ucp-desktop': '79968',
		'ucp-mobile': '79968',
		tvguide: '79974',
		giantbomb: '85122',
		metacritic: '85123',
		'metacritic-neutron': '85123',
		fanatical: '85124',
		sports: '85125',
	};

	private getPublisherId() {
		const appName = window.ads.context.app;
		return this.publisherIds[appName];
	}

	getConfig(): Partial<UserIdConfig> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		const publisherId = this.getPublisherId();
		if (!publisherId) {
			utils.logger(logGroup, 'Invalid app id');
			return;
		}

		utils.logger(logGroup, 'enabled');

		return {
			name: 'liveIntentId',
			params: {
				publisherId: publisherId,
				requestedAttributesOverrides: {
					uid2: true,
					bidswitch: false,
					medianet: true,
					magnite: true,
					pubmatic: true,
					index: true,
				},
				ajaxTimeout: 1000,
				liCollectConfig: {
					fpiStorageStrategy: 'ls',
					fpiExpirationDays: 730,
				},
			},
		};
	}

	private isEnabled(): boolean {
		return (
			context.get('bidders.liveIntentConnectedId.enabled') &&
			!context.get('options.optOutSale') &&
			!utils.isCoppaSubject()
		);
	}
}

export const connectedId = new ConnectedId();
