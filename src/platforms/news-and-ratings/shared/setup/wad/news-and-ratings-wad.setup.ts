import { Injectable } from '@wikia/dependency-injection';

import { context, InstantConfigService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { queryString } from '@ad-engine/utils';

@Injectable()
export class NewsAndRatingsWadSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): Promise<void> | void {
		const babEnabled = this.instantConfig.get('icBabDetection');

		// BlockAdBlock detection
		context.set('options.wad.enabled', babEnabled);

		if (babEnabled) {
			context.set('options.wad.btRec.enabled', this.instantConfig.get('icBTRec'));
		}

		if (queryString.get('switch_bt_loader')) {
			context.set(
				'options.wad.btRec.loaderUrl',
				'//btloader.com/tag?o=6209001497821184&upapi=true',
			);
		}
	}
}
