import { context, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const logGroup = 'liveConnect';
const liveConnectScriptUrl = 'https://b-code.liadm.com/a-07ev.min.js';

class LiveConnect {
	private isLoaded = false;
	private id: string | null;

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

			utils.scriptLoader
				.loadScript(liveConnectScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'loaded');
					this.track();
				});

			this.isLoaded = true;
		}
	}

	track(): void {
		if (!window.liQ) {
			utils.warner(logGroup, 'window.liQ not available for tracking');
		} else {
			window.liQ.resolve(
				(nonId) => {
					utils.logger(logGroup, `sha2: ${nonId['sha2']}`);
					if (nonId['sha2']) {
						this.id = nonId['sha2'];

						communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
							partnerName: logGroup,
							partnerIdentityId: this.id,
						});
					}
				},
				(err) => {
					utils.warner(logGroup, err);
				},
				{ qf: '0.3', resolve: 'sha2' },
			);
			window.liQ.resolve((nonId) => {
				utils.logger(logGroup, `[DEBUGGING] unifiedId: ${nonId['unifiedId']}`);
			}); // TODO this one resolve is only for debugging and can be removed when ADEN-11824 is tested
			window.liQ.resolve(
				(nonId) => {
					utils.logger(logGroup, `[DEBUGGING] sha2 with qf=0.1: ${nonId['sha2']}`);
				},
				(err) => {
					utils.warner(logGroup, err);
				},
				{ qf: '0.1', resolve: 'sha2' },
			); // TODO this one resolve is only for debugging and can be removed when ADEN-11824 is tested
		}
	}
}

export const liveConnect = new LiveConnect();
