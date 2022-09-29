import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

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
	{ id: 'sha256', name: `${partnerName}-sha256`, params: { qf: '0.3', resolve: 'sha256' } },
	{ id: 'md5', name: `${partnerName}-md5`, params: { qf: '0.3', resolve: 'md5' } },
	{ id: 'sha1', name: `${partnerName}-sha1`, params: { qf: '0.3', resolve: 'sha1' } },
	{ id: 'gender', name: `${partnerName}-gender`, params: { qf: '0.3', resolve: 'gender' } },
	{ id: 'age', name: `${partnerName}-age`, params: { qf: '0.3', resolve: 'age' } },
];

class LiveConnect extends BaseServiceSetup {
	private isLoaded = false;

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
		}
	}

	resolveId(idName, partnerName) {
		return (nonId) => {
			const partnerIdentityId = nonId[idName];

			if (idName === 'unifiedId') {
				communicationService.emit(eventsRepository.LIVE_CONNECT_RESPONDED_UUID);
			}
			utils.logger(logGroup, `id ${idName}: ${partnerIdentityId}`);

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
}

export const liveConnect = new LiveConnect();
