import { communicationService, eventsRepository } from '@ad-engine/communication';
import { pbjsFactory } from '@ad-engine/core';
import { logger } from '@ad-engine/utils';

export class IdRetriever {
	private static _instance: IdRetriever;

	private readonly logGroup = 'bidder-id-retriever';
	private pbjs: Pbjs;

	static get(): IdRetriever {
		return (this._instance ??= new IdRetriever());
	}

	async getIds(): Promise<PrebidEids[]> {
		logger(this.logGroup, 'Retrieving tracking ids');
		this.pbjs = await pbjsFactory.init();
		return this.pbjs.getUserIdsAsEids();
	}

	async saveCurrentPrebidIds(): Promise<void> {
		const ids: PrebidEids[] = await this.getIds();
		logger(this.logGroup, 'Saving tracking ids', ids);
		ids.forEach((id) => {
			logger(this.logGroup, 'Saving tracking id provided by ', id.source, id.uids[0]?.id);
			if (id.uids[0]?.id) {
				communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
					partnerName: id.source,
					partnerIdentityId: id.uids[0]?.id,
				});
			}
		});
	}
}

export const prebidIdRetriever = new IdRetriever();
