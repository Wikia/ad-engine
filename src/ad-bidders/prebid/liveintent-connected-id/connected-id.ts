import { context } from '@ad-engine/core';
import { isCoppaSubject, logger } from '@ad-engine/utils';
import { UserIdConfig } from '../index';

const logGroup = 'LiveIntentConnectedId';

export class ConnectedId {
	private publisherIds = {
		gamespot: '79973',
		fandom: '79968',
		tvguide: '79974',
	};

	private getPublisherId() {
		const url = window.location.href;
		switch (true) {
			case url.includes('gamespot'):
				return this.publisherIds['gamespot'];
			case url.includes('tvguide'):
				return this.publisherIds['tvguide'];
			case url.includes('fandom'):
				return this.publisherIds['fandom'];
			default:
				return;
		}
	}

	getConfig(): Partial<UserIdConfig> {
		if (!this.isEnabled()) {
			logger(logGroup, 'disabled');
			return;
		}
		const publisherId = this.getPublisherId();
		logger(logGroup, 'enabled');
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
			!isCoppaSubject()
		);
	}
}

export const connectedId = new ConnectedId();
