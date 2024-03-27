// @ts-strict-ignore
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, pbjsFactory, targetingService, UniversalStorage, utils } from '@ad-engine/core';

export class IdRetriever {
	public static YAHOO_BIT = 0;
	public static ID5_BIT = 1;
	public static HEM_BIT = 2;
	public static LIVEINTENT_BIT = 3;
	public static PUBCID_BIT = 4;

	private static _instance: IdRetriever;
	private readonly ID_STRING_LENGTH = 16;
	private readonly logGroup = 'bidder-id-retriever';
	private pbjs: Pbjs;

	private readonly ID_MAP: Record<string, (sources: PrebidEids[]) => string> = {
		[IdRetriever.YAHOO_BIT.toString()]: (sources: PrebidEids[]) =>
			this.getDefaultBitStatus(sources, 'yahoo.com'),
		[IdRetriever.ID5_BIT.toString()]: (sources: PrebidEids[]) =>
			this.getDefaultBitStatus(sources, 'id5-sync.com'),
		[IdRetriever.HEM_BIT.toString()]: () => this.getHEMBitStatus(),
		[IdRetriever.LIVEINTENT_BIT.toString()]: (sources: PrebidEids[]) =>
			this.getDefaultBitStatus(sources, 'liveintent.com'),
		[IdRetriever.PUBCID_BIT.toString()]: (sources: PrebidEids[]) =>
			this.getDefaultBitStatus(sources, 'pubcid.org'),
	};

	static get(): IdRetriever {
		return (this._instance ??= new IdRetriever());
	}

	// Generated IDString will be sent to GAM in this form:
	// PZALxxxxxxxxxxxxxxxxx
	// Where P is Present, A is Absent and x is empty placeholder for new IDs
	// L, M and Z are partner-specific values. L = LiveIntent HEM, M = MediaWiki HEM, Z = id5=0
	async generateBoiString(): Promise<string> {
		const prebidUserIds = await this.getIds();
		let idString = '';
		for (let i = 0; i < this.ID_STRING_LENGTH; i++) {
			const idProvider = this.ID_MAP[i.toString()];
			if (idProvider) {
				const bitStatus = idProvider(prebidUserIds);
				idString += bitStatus;
			} else {
				idString += this.getBitPlaceholder();
			}
		}

		utils.logger(this.logGroup, 'Generated BOI string ', idString);
		return idString;
	}

	async getIds(): Promise<PrebidEids[]> {
		utils.logger(this.logGroup, 'Retrieving tracking ids');
		this.pbjs = await pbjsFactory.init();
		return this.pbjs.getUserIdsAsEids() ?? [];
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

	private getDefaultBitStatus(prebidUserIds: PrebidEids[], sourceName): string {
		return prebidUserIds.find((obj) => obj.source === sourceName) ? 'P' : 'A';
	}

	private getBitPlaceholder(): string {
		return 'x';
	}

	// HEM bit status is determined by the presence of HEM provided by LiveIntent (L) or MediaWiki (M).
	// In case if there is no HEM present, the bit is set to P.
	private getHEMBitStatus(): string {
		const storage = new UniversalStorage();
		switch (true) {
			case !!storage.getItem('liveConnect'):
				return 'L';
			case !!context.get('wiki.opts.userEmailHashes'):
				return 'M';
			default:
				return 'A';
		}
	}
}

export const prebidIdRetriever = new IdRetriever();
