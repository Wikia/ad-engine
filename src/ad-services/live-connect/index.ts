import { BaseServiceSetup, context, localCache, utils, UniversalStorage } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

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

	call(): void {
		if (!this.isEnabled(['services.liveConnect.enabled', 'services.liveConnect.cachingStrategy'])) {
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
			communicationService.emit(eventsRepository.LIVE_CONNECT_CACHED);
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

			this.storage.setItem(partnerName, partnerIdentityId, this.storageConfig.ttl);

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
			if (!this.isAvailableInStorage(name)) {
				this.resolveAndReportId(id, name, params);
			}
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

		for (const param of this.storageConfig.mandatoryParams) {
			const storageKey = idConfigMapping.find((config) => config.id === param)?.name;

			if (!this.isAvailableInStorage(storageKey)) {
				shouldLoadScript = true;
				break;
			}
		}

		return shouldLoadScript;
	}

	isAvailableInStorage(key: string): boolean {
		return !!this.storage.getItem(key);
	}
}

export const liveConnect = new LiveConnect();
