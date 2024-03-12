import { communicationService, eventsRepository } from '@ad-engine/communication';
import { localCache, UniversalStorage } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, scriptLoader, warner } from '@ad-engine/utils';

interface IdConfig {
	id: LiQResolveParams;
	name: string;
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
	private fallbackQf = '0.3';

	call(): void {
		if (
			!this.isEnabled('icLiveConnect') ||
			!this.isEnabled('icLiveConnectCachingStrategy') ||
			this.isEnabled('icIdentityPartners', false)
		) {
			logger(logGroup, 'disabled');
			return;
		}

		this.setupStorage();

		if (this.shouldLoadScript()) {
			logger(logGroup, 'loading');
			communicationService.emit(eventsRepository.LIVE_CONNECT_STARTED);

			scriptLoader.loadScript(liveConnectScriptUrl, true, 'first').then(() => {
				logger(logGroup, 'loaded');
				this.resolveAndTrackIds();
			});
		} else {
			communicationService.emit(eventsRepository.LIVE_CONNECT_CACHED);
			logger(logGroup, `already loaded and available in ${this.storageConfig.type}Storage`);
		}
	}

	resolveAndTrackIds(): void {
		if (!window.liQ) {
			warner(logGroup, 'window.liQ not available for tracking');
			return;
		}
		const customQf = this.instantConfig.get<number>('icLiveConnectQf')?.toString();
		window.liQ.resolve(
			(result) => {
				this.trackIds(result);
			},
			(err) => {
				console.error(err);
			},
			{ qf: customQf || this.fallbackQf, resolve: idConfigMapping.map((config) => config.id) },
		);
	}

	trackIds(liQResponse: LiQResolveResponse): void {
		logger(logGroup, 'resolve response:', liQResponse);

		Object.keys(liQResponse).forEach((key) => {
			const trackingKeyName = this.getTrackingKeyName(key);

			if (this.isAvailableInStorage(trackingKeyName)) {
				return;
			}

			if (key === 'unifiedId') {
				communicationService.emit(eventsRepository.LIVE_CONNECT_RESPONDED_UUID);
			}

			const partnerIdentityId = liQResponse[key];

			logger(logGroup, `${key}: ${partnerIdentityId}`);

			if (!partnerIdentityId) {
				return;
			}

			this.storage.setItem(trackingKeyName, partnerIdentityId, this.storageConfig.ttl);

			communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
				partnerName: trackingKeyName,
				partnerIdentityId,
			});
		});
	}

	getTrackingKeyName(key: string): string {
		return idConfigMapping.find((config) => config.id === key)?.name;
	}

	setupStorage(): void {
		this.storageConfig = this.instantConfig.get<CachingStrategyConfig>(
			'icLiveConnectCachingStrategy',
		);

		if (this.storageConfig.type === 'local') {
			this.storage = localCache;
		} else {
			this.storage = new UniversalStorage(() => window.sessionStorage);
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
