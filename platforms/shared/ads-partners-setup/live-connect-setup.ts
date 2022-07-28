import {
	BaseServiceSetup,
	communicationService,
	context,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
const partnerName = 'liveConnect';
const partnerNameUnifiedId = 'liveConnect-unifiedId';
const logGroup = partnerName;
const liveConnectScriptUrl = 'https://b-code.liadm.com/a-07ev.min.js';

class LiveConnectSetup extends BaseServiceSetup {
	private isEnabled(): boolean {
		return (
			context.get('services.liveConnect.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	initialize() {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			this.res();
		} else {
			utils.logger(logGroup, 'loading');
			utils.scriptLoader
				.loadScript(liveConnectScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'loaded');
					this.res();
					this.track();
				});
		}
	}

	resolveAndReportId(idName: string, partnerName: string, params: any = undefined) {
		window.liQ.resolve(
			(nonId) => {
				const id = nonId[idName];
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

export const liveConnectSetup = new LiveConnectSetup();
