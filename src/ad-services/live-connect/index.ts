import { BaseServiceSetup, context, localCache, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { UniversalStorage } from '../../ad-engine/services/universal-storage';

interface IdConfig {
	id: string;
	name: string;
	params?: LiQParams;
}

interface CachingStrategyConfig {
	type: 'local' | 'session';
	mandatoryParams: string[];
	ttl?: number;
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
	private storage;
	private storageConfig: CachingStrategyConfig;

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

		this.setupStorage();

		if (this.shouldLoadScript()) {
			utils.logger(logGroup, 'loading');
			communicationService.emit(eventsRepository.LIVE_CONNECT_STARTED);

			utils.scriptLoader
				.loadScript(liveConnectScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'loaded');
					this.track();
				});
		} else {
			utils.logger(logGroup, `already loaded and available in ${this.storageConfig.type}Storage`);
		}
	}

	resolveId(idName, partnerName) {
		return (nonId) => {
			const partnerIdentityId = nonId[idName];

			utils.logger(logGroup, `id ${idName}: ${partnerIdentityId}`);

			if (idName === 'unifiedId') {
				communicationService.emit(eventsRepository.LIVE_CONNECT_RESPONDED_UUID);
			}

			if (!partnerIdentityId) {
				return;
			}

			this.saveToStorage(partnerName, partnerIdentityId);

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

	setupStorage(): void {
		this.storageConfig = context.get('services.liveConnect.cachingStrategy');

		if (this.storageConfig.type === 'local') {
			this.storage = localCache;
		} else {
			this.storage = new UniversalStorage(window.sessionStorage);
		}
	}

	shouldLoadScript(): boolean {
		if (!this.storageConfig) {
			return true;
		}

		let shouldLoadScript = false;

		this.storageConfig.mandatoryParams.forEach((param) => {
			const storageKey = this.getConfigName(param);
			if (!this.isAvailableInStorage(storageKey)) {
				shouldLoadScript = true;
			}
		});

		return shouldLoadScript;
	}

	isAvailableInStorage(key: string): boolean {
		return !!this.getStorageData(key);
	}

	getStorageData(key: string) {
		if (this.storageConfig.type === 'local') {
			return this.storage.get(key);
		} else {
			return this.storage.getItem(key);
		}
	}

	saveToStorage(key: string, value: string) {
		const idName = this.getConfigId(key);

		if (!this.storageConfig.mandatoryParams.includes(idName)) {
			return;
		}

		if (this.storageConfig.type === 'local') {
			this.storage.set(key, value, this.storageConfig.ttl);
		} else {
			this.storage.setItem(key, value);
		}
	}

	getConfigId(name: string) {
		return idConfigMapping.find((config) => config.name === name).id;
	}

	getConfigName(id: string): string {
		return idConfigMapping.find((config) => config.id === id).name;
	}
}

export const liveConnect = new LiveConnect();
