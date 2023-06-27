import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, localCache, UniversalStorage, utils } from '@ad-engine/core';

interface IdConfig {
	id: string;
	name: string;
}

interface LiQResolveResponse {
	sha1?: string;
	sha2?: string;
	md5?: string;
	unifiedId?: string;
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
	{ id: 'sha2', name: partnerName },
	{ id: 'md5', name: `${partnerName}-md5` },
	{ id: 'sha1', name: `${partnerName}-sha1` },
];

export class LiveConnect extends BaseServiceSetup {
	private storage;
	private storageConfig: CachingStrategyConfig;

	call(): void {
		if (
			!this.isEnabled(['services.liveConnect.enabled', 'services.liveConnect.cachingStrategy']) ||
			this.isEnabled('icIdentityPartners', false)
		) {
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
					this.resolveAndTrackIds();
				});
		} else {
			communicationService.emit(eventsRepository.LIVE_CONNECT_CACHED);
			utils.logger(logGroup, `already loaded and available in ${this.storageConfig.type}Storage`);
		}
	}

	resolveAndTrackIds(): void {
		if (!window.liQ) {
			utils.warner(logGroup, 'window.liQ not available for tracking');
			return;
		}

		window.liQ.resolve(
			(result) => {
				this.trackIds(result);
			},
			(err) => {
				console.error(err);
			},
			{ qf: '0.3', resolve: ['sha1', 'sha2', 'md5', 'unifiedId'] },
		);
	}

	trackIds(liQResponse: LiQResolveResponse): void {
		idConfigMapping.forEach(({ id, name }) => {
			if (!this.isAvailableInStorage(name)) {
				return;
			}

			if (liQResponse.unifiedId) {
				communicationService.emit(eventsRepository.LIVE_CONNECT_RESPONDED_UUID);
			}

			const partnerIdentityId = liQResponse[id];

			utils.logger(logGroup, `id ${id}: ${partnerIdentityId}`);

			if (!partnerIdentityId) {
				return;
			}

			this.storage.setItem(partnerName, partnerIdentityId, this.storageConfig.ttl);

			communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
				partnerName: name,
				partnerIdentityId,
			});
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
