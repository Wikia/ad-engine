import { context, utils } from '@ad-engine/core';

const logGroup = 'liveConnect';
const liveConnectScriptUrl = 'https://b-code.liadm.com/a-07ev.min.js';

class LiveConnect {
	private isLoaded = false;

	private isEnabled(): boolean {
		return (
			context.get('services.liveConnect.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	private logInfoWithSpecifiedQf(featureName: string, qf: number): void {
		window.liQ.resolve(
			(nonId) => {
				console.log(`liveConnect ${featureName} with qf=${qf}:`, nonId[featureName]);
			},
			(err) => {
				console.error(err);
			},
			{ qf: qf, resolve: featureName },
		);
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading');
			const qf = parseFloat(utils.queryString.get('qf')) || 0.1;

			utils.scriptLoader
				.loadScript(liveConnectScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'loaded');
					window.liQ.resolve((nonId) => {
						console.log('liveConnect nonId object', nonId);
					});
					this.logInfoWithSpecifiedQf('md5', qf);
					this.logInfoWithSpecifiedQf('sha1', qf);
					this.logInfoWithSpecifiedQf('sha2', qf);
					this.logInfoWithSpecifiedQf('age', qf);
					this.logInfoWithSpecifiedQf('gender', qf);
				});

			this.isLoaded = true;
		}
	}
}

export const liveConnect = new LiveConnect();
