import { BaseServiceSetup, targetingService, utils } from '@ad-engine/core';
import { injectable } from 'tsyringe';

const logGroup = 'double-verify';
const scriptUrl =
	'//pub.doubleverify.com/signals/pub.js?ctx=28150781&cmp=DV1001654&signals=ids,bsc';

@injectable()
export class DoubleVerify extends BaseServiceSetup {
	call(): Promise<void> {
		if (!this.isEnabled('icDoubleVerify')) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		window.PQ = window.PQ || { cmd: [] };

		this.setupSignalsLoad();

		utils.logger(logGroup, 'loading', scriptUrl);

		return utils.scriptLoader
			.loadScript(scriptUrl, 'text/javascript', true, null, {
				referrerpolicy: 'no-referrer-when-downgrade',
			})
			.then(() => {
				utils.logger(logGroup, 'ready');
			})
			.catch(() => {
				utils.logger(logGroup, 'error on loading');
			});
	}

	private setupSignalsLoad() {
		window.PQ.cmd.push(() => {
			utils.logger(logGroup, 'getting signals');
			window.PQ?.getTargeting({ signals: ['ids', 'bsc'] }, (error, targetingData) => {
				if (error) {
					return;
				}

				utils.logger(logGroup, 'setting targeting', targetingData);
				targetingService.set('ids', targetingData['IDS']?.toString());
				targetingService.set('bsc', targetingData['BSC']);
			});
		});
	}
}
