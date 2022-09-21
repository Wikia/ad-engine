import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { UniversalStorage } from '../../ad-engine/services/universal-storage';

interface IdConfig {
	id: string;
	name: string;
	params?: LiQParams;
}

const partnerName = 'liveConnect';
const logGroup = partnerName;
const liveConnectScriptUrl = 'https://b-code.liadm.com/a-07ev.min.js';

const idConfigMapping: IdConfig[] = [
	{ id: 'unifiedId', name: `${partnerName}-unifiedId` },
	{ id: 'sha2', name: partnerName, params: { qf: '0.3', resolve: 'sha2' } },
	{ id: 'md5', name: `${partnerName}-md5`, params: { qf: '0.3', resolve: 'md5' } },
	{ id: 'sha1', name: `${partnerName}-sha1`, params: { qf: '0.3', resolve: 'sha1' } },
];

class LiveConnect extends BaseServiceSetup {
	private isLoaded: boolean;
	private storage: UniversalStorage;

	constructor() {
		super();
		this.storage = new UniversalStorage();
	}

	private isEnabled(): boolean {
		return (
			context.get('services.liveConnect.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		this.isLoaded = this.isAvailableInLocalStorage(`${partnerName}-unifiedId`);

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading');
			communicationService.emit(eventsRepository.LIVE_CONNECT_STARTED);

			utils.scriptLoader
				.loadScript(liveConnectScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'loaded');
					this.track();
				});

			this.isLoaded = true;
		} else {
			utils.logger(logGroup, 'already loaded and available in localStorage');
		}
	}

	resolveId(idName, partnerName) {
		return (nonId) => {
			const partnerIdentityId = nonId[idName];

			utils.logger(logGroup, `id ${idName}: ${partnerIdentityId}`);

			if (idName === 'unifiedId') {
				communicationService.emit(eventsRepository.LIVE_CONNECT_RESPONDED_UUID);
				this.saveToLocalStorage(partnerName, partnerIdentityId);
			}

			if (!partnerIdentityId) {
				return;
			}

			communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
				partnerName,
				partnerIdentityId,
			});
		};
	}

	resolveAndReportId(idName: string, partnerName: string, params?: LiQParams) {
		window.liQ.resolve(
			this.resolveId(idName, partnerName),
			(err) => {
				utils.warner(logGroup, err);
			},
			params,
		);
	}

	track(): void {
		if (!window.liQ) {
			utils.warner(logGroup, 'window.liQ not available for tracking');
			return;
		}
		idConfigMapping.forEach(({ id, name, params }) => {
			this.resolveAndReportId(id, name, params);
		});
	}

	isAvailableInLocalStorage(key: string): boolean {
		return !!this.getLocalStorageData(key);
	}

	getLocalStorageData(key: string) {
		return this.storage.getItem(key);
	}

	saveToLocalStorage(key: string, value: string) {
		utils.logger(logGroup, `Saving to localStorage: ${key}`);

		this.storage.setItem(key, value);
	}
}

export const liveConnect = new LiveConnect();
