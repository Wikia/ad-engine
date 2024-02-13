import { communicationService, eventsRepository } from '@ad-engine/communication';
import { pbjsFactory, targetingService, UniversalStorage, utils } from '@ad-engine/core';

export class IdRetriever {
	private static _instance: IdRetriever;
	private readonly ID_STRING_LENGTH = 16;
	private readonly logGroup = 'bidder-id-retriever';
	private pbjs: Pbjs;

	private readonly ID_MAP = {
		0: 'yahoo.com',
		1: 'id5-sync.com',
		2: 'HEM',
		3: 'liveintent.com',
	};

	static get(): IdRetriever {
		return (this._instance ??= new IdRetriever());
	}

	// Generated IDString will be sent to GAM in this form:
	// PZALxxxxxxxxxxxxxxxxx
	// Where P is Present, A is Absent and x is empty placeholder for new IDs
	// L, M and Z are partner-specific values. L = LiveIntent HEM, M = MediaWiki HEM, Z = id5=0
	async generateBoiString() {
		const prebidUserIds = await this.getIds();
		const idSources: string[] = prebidUserIds.map((id) => id.source);
		const idString = new Array(this.ID_STRING_LENGTH).fill('x');
		Object.keys(this.ID_MAP).forEach((idTouple) => {
			const idProvider = this.ID_MAP[idTouple];
			switch (idProvider) {
				case 'id5-sync.com':
					return (idString[idTouple] = this.getID5BitStatus(prebidUserIds));
				case 'HEM':
					return (idString[idTouple] = this.getHEMBitStatus());
				default:
					return (idString[idTouple] = idSources.includes(this.ID_MAP[idTouple]) ? 'P' : 'A');
			}
		});
		utils.logger(this.logGroup, 'Generated BOI string ', idString);
		return idString.join('');
	}

	async getIds(): Promise<PrebidEids[]> {
		utils.logger(this.logGroup, 'Retrieving tracking ids');
		this.pbjs = await pbjsFactory.init();
		return this.pbjs.getUserIdsAsEids() || [];
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

	private getID5BitStatus(prebidUserIds: PrebidEids[]): string {
		const id5IdentityObject = prebidUserIds.find((obj) => obj.source === 'id5-sync.com');
		if (!id5IdentityObject) {
			return 'A';
		}
		return id5IdentityObject.uids[0]?.id === '0' ? 'Z' : 'P';
	}

	// HEM bit status is determined by the presence of HEM provided by LiveIntent (L) or MediaWiki (M).
	// In case if there is no HEM present, the bit is set to P.
	private getHEMBitStatus(): string {
		const storage = new UniversalStorage();
		switch (true) {
			case !!storage.getItem('liveConnect'):
				return 'L';
			case !!window.ads.context?.opts?.userEmailHashes:
				return 'M';
			default:
				return 'A';
		}
	}
}

export const prebidIdRetriever = new IdRetriever();
