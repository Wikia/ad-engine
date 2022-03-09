import { context, DiProcess, Targeting, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

type LayoutPayload = {
	layout: string;
	data: any;
};

interface FanTakeoverLayoutPayload extends LayoutPayload {
	data: {
		impression: string;
		lineItemId: number;
		creativeId: number;
	};
}

const logGroup = 'layout-initializer';

@Injectable()
export class AdLayoutInitializerSetup implements DiProcess {
	private lisAdUnit =
		'/5441/wka1b.LIS/layout_initializer/desktop/ucp_desktop-fandom-article-ic/_top1k_wiki-life';
	private lisSize = '1x1';
	private lisTargeting: Targeting = {
		loc: 'pre',
		pos: 'layout_initializer',
	};

	async execute(): Promise<void> {
		if (!context.get('options.initCall')) {
			utils.logger(logGroup, 'LIS call disabled');

			return Promise.reject();
		}

		const lisUrl = utils.buildTaglessRequestUrl({
			adUnit: this.lisAdUnit,
			size: this.lisSize,
			targeting: {
				...context.get('targeting'),
				...this.lisTargeting,
				src: context.get('src'),
			},
		});

		utils.logger(logGroup, 'LIS URL built: ', lisUrl);

		await utils.scriptLoader.loadAsset(lisUrl, 'text').then((response) => {
			if (!response) {
				return Promise.reject();
			}

			try {
				const layoutPayload: LayoutPayload = JSON.parse(response);

				utils.logger(logGroup, 'Layout payload received', layoutPayload);

				if (layoutPayload.layout === 'uap') {
					context.set('targeting.uap', (layoutPayload as FanTakeoverLayoutPayload).data.lineItemId);
					context.set(
						'targeting.uap_c',
						(layoutPayload as FanTakeoverLayoutPayload).data.creativeId,
					);
				}

				return Promise.resolve();
			} catch (e) {
				return Promise.reject();
			}
		});
	}
}
