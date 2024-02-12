import { communicationService, eventsRepository } from '@ad-engine/communication';
import { pbjsFactory, targetingService, utils } from '@ad-engine/core';

export class IdRetriever {
	private static _instance: IdRetriever;
	private readonly ID_STRING_LENGTH = 16;
	private readonly logGroup = 'bidder-id-retriever';
	private pbjs: Pbjs;

	private readonly ID_MAP = {
		0: 'yahoo.com',
		1: 'id5-sync.com',
		2: 'liveConnect',
		3: 'Experian',
		4: 'liveintent.com',
	};

	// Generated IDString will be sent to GAM in this form:
	// PAAAAxxxxxxxxxxxxxxxx
	// Where P is Present, A is Absent and x is empty placeholder for new IDs
	private async generateBoiString() {
		const userIds: string[] = (await this.getIds()).map((id) => id.source);
		const idString = new Array(this.ID_STRING_LENGTH).fill('x');
		Object.keys(this.ID_MAP).forEach((idTouple) => {
			idString[idTouple] = userIds.includes(this.ID_MAP[idTouple]) ? 'P' : 'A';
		});
		utils.logger(this.logGroup, 'Generated id string ', idString);
		return idString.join('');
	}

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

		const idString = await this.generateBoiString();
		targetingService.set('boi', idString);
	}
}

export const prebidIdRetriever = new IdRetriever();
