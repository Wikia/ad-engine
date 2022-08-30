import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const partnerName = 'liveConnect';
const partnerNameUnifiedId = 'liveConnect-unifiedId';
const logGroup = partnerName;
const liveConnectScriptUrl = 'https://b-code.liadm.com/a-07ev.min.js';

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

	resolveAndReportId(idName: string, partnerName: string, params: any = undefined) {
		window.liQ.resolve(
			(nonId) => {
				const id = nonId[idName];

				if (idName === 'unifiedId') {
					communicationService.emit(eventsRepository.LIVE_CONNECT_RESPONDED_UUID);
				}
				utils.logger(logGroup, `id ${idName}: ${id}`);

				if (id) {
					communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
						partnerName: partnerName,
						partnerIdentityId: id,
					});
				}
			},
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
		this.resolveAndReportId('unifiedId', partnerNameUnifiedId);
		this.resolveAndReportId('sha2', partnerName, { qf: '0.3', resolve: 'sha2' });
	}
}

export const liveConnect = new LiveConnect();
