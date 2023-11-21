import { BaseServiceSetup, utils } from '@wikia/ad-engine';

const logGroup = 'tagless-request';

export class TaglessRequestSetup extends BaseServiceSetup {
	async call(): Promise<void> {
		const videoTaglessRequestUrl = utils.buildVastUrl(16 / 9, 'video', {
			videoAdUnitId:
				'/5441/wka1b.VIDEO/featured/smartphone/ucp_mobile-fandom-fv-article/_project43-life',
			customParams: 'npa=0&artid=355&&s1=_project43&cid=adeng-uap-jwp&src=test&pos=featured',
		});

		utils.logger(logGroup, 'Sending a tagless request: ', videoTaglessRequestUrl);
		await fetch(videoTaglessRequestUrl).then((res) =>
			utils.logger(logGroup, 'Response received', res),
		);

		return Promise.resolve();
	}
}
