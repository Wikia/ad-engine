import { communicationService, eventsRepository } from '@ad-engine/communication';
import { pbjsFactory, utils } from '@ad-engine/core';

export class IdRetriever {
	private static _instance: IdRetriever;

	private readonly logGroup = 'bidder-id-retriever';
	private pbjs: Pbjs;

	static get(): IdRetriever {
		return (this._instance ??= new IdRetriever());
	}

	async getIds(): Promise<PrebidEids[]> {
		utils.logger(this.logGroup, 'Retrieving tracking ids');
		this.pbjs = await pbjsFactory.init();
		return this.pbjs.getUserIdsAsEids();
	}

	async saveCurrentPrebidIds(): Promise<void> {
		const ids: PrebidEids[] = await this.getIds();
		utils.logger(this.logGroup, 'Saving tracking ids', ids);
		ids.forEach((id) => {
			utils.logger(this.logGroup, 'Saving tracking id provided by ', id.source, id.uids[0]?.id);
			if (id.uids[0]?.id) {
				communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
					partnerName: id.source,
					partnerIdentityId: id.uids[0]?.id,
				});
			}
		});
	}
}
