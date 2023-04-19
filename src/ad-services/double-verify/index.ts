import { BaseServiceSetup, utils } from '@ad-engine/core';

const logGroup = 'double-verify';
const scriptUrl = '//pub.doubleverify.com/signals/pub.js#ctx=28150781&cmp=DV993185';

export class DoubleVerify extends BaseServiceSetup {
	call(): Promise<void> {
		if (!this.isEnabled('icDoubleVerify')) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		window.PQ = window.PQ || { cmd: [] };

		this.setupSignalsLoad();

		utils.logger(logGroup, 'loading', scriptUrl);

		return utils.scriptLoader.loadScript(scriptUrl).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}

	private setupSignalsLoad() {
		window.PQ.cmd.push(() => {
			utils.logger(logGroup, 'getting signals');
			window.PQ?.loadSignals(['ids', 'bsc', 'vlp', 'tvp']);
		});
	}
}
