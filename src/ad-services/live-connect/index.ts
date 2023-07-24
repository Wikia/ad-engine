import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, localCache, UniversalStorage, utils } from '@ad-engine/core';
import { MetricReporter } from '../../platforms/shared';

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
	private defaultQfValue = '0.3';
	private metricReporter: MetricReporter;

	call(): void {
		if (
			!this.isEnabled('icLiveConnect') ||
			!this.isEnabled('icLiveConnectCachingStrategy') ||
			this.isEnabled('icIdentityPartners', false)
		) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		this.metricReporter = new MetricReporter();

		this.setupStorage();

		if (this.shouldLoadScript()) {
			utils.logger(logGroup, 'loading');
			communicationService.emit(eventsRepository.LIVE_CONNECT_STARTED);

			utils.scriptLoader.loadScript(liveConnectScriptUrl, true, 'first').then(() => {
				utils.logger(logGroup, 'loaded');
				this.resolveAndTrackIds();
				this.logEvent('live-connect-requested');
				const customQf = this.instantConfig.get<number>('icLiveConnectQf')?.toString();
				if (customQf) {
					this.resolveAndTrackIds(customQf);
				}
			});
		} else {
			communicationService.emit(eventsRepository.LIVE_CONNECT_CACHED);
			utils.logger(logGroup, `already loaded and available in ${this.storageConfig.type}Storage`);
		}
	}

	resolveAndTrackIds(qf?: string): void {
		if (!window.liQ) {
			utils.warner(logGroup, 'window.liQ not available for tracking');
			return;
		}

		window.liQ.resolve(
			(result) => {
				this.trackIds(result, qf);
			},
			(err) => {
				console.error(err);
			},
			{ qf: qf || this.defaultQfValue, resolve: idConfigMapping.map((config) => config.id) },
		);
	}

	trackIds(liQResponse: LiQResolveResponse, customQf?: string): void {
		utils.logger(logGroup, 'resolve response:', liQResponse);

		Object.keys(liQResponse).forEach((key) => {
			const trackingKeyName = this.getTrackingKeyName(key) + (customQf ? `-${customQf}` : '');

			if (this.isAvailableInStorage(trackingKeyName)) {
				return;
			}

			if (key === 'unifiedId') {
				communicationService.emit(eventsRepository.LIVE_CONNECT_RESPONDED_UUID);
			}

			const partnerIdentityId = liQResponse[key];

			utils.logger(logGroup, `${key}: ${partnerIdentityId}`);

			if (!partnerIdentityId) {
				return;
			}

			if (!customQf && key === 'sha2') {
				this.logEvent('live-connect-sha2');
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

	logEvent(event: string): void {
		this.metricReporter.sendCustomEvent(
			{ action: event, duration: Math.floor(utils.getTimeDelta()) },
			context.get('services.instantConfig.appName'),
			'https://services.fandom.com/adeng/api/identity/metrics',
		);
	}
}
