import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, scriptLoader } from '@ad-engine/utils';

const logGroup = 'stroer';

export class Stroer extends BaseServiceSetup {
	call(): Promise<void> {
		if (!this.isEnabled('icStroer', false)) {
			logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		const libraryUrl = `//js.adscale.de/map.js`;

		logger(logGroup, 'loading', libraryUrl);

		return scriptLoader.loadScript(libraryUrl, false).then(() => {
			logger(logGroup, 'ready');
		});
	}
}
