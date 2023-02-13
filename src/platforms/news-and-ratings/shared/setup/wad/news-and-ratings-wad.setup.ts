import { injectable } from 'tsyringe';

import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';

@injectable()
export class NewsAndRatingsWadSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): Promise<void> | void {
		const babEnabled = this.instantConfig.get('icBabDetection');

		// BlockAdBlock detection
		context.set('options.wad.enabled', babEnabled);

		if (babEnabled) {
			context.set('options.wad.btRec.enabled', this.instantConfig.get('icBTRec'));
		}

		if (utils.queryString.get('switch_bt_loader')) {
			context.set(
				'options.wad.btRec.loaderUrl',
				'//btloader.com/tag?o=6209001497821184&upapi=true',
			);
		}
	}
}
