import { BaseServiceSetup, utils } from '@wikia/ad-engine';

const logGroup = 'tagless-request';

export class TaglessRequest extends BaseServiceSetup {
	private baseUrl = 'https://securepubads.g.doubleclick.net/gampad/adx';

	async call(): Promise<void> {
		const adUnit =
			'/5441/wka1b.VIDEO/featured/smartphone/ucp_mobile-fandom-fv-article/_project43-life';
		const size = '640x480';
		const correlator = '1234567890';
		const delayedImpression = '1';
		const targeting = encodeURIComponent(
			'hostpre=project43&uap=none&uap_c=none&artid=355&kid_wiki=0&s1=_project43&s2=fv-article&cid=adeng-uap-jwp&src=test&pos=featured&rv=1',
		);
		const taglessRequestUrl = `${this.baseUrl}?iu=${adUnit}&sz=${size}&c=${correlator}&d_imp=${delayedImpression}&t=${targeting}`;

		utils.logger(logGroup, 'Sending a tagless request: ', taglessRequestUrl);
		await fetch(taglessRequestUrl).then((res) => utils.logger(logGroup, 'Response received', res));

		return Promise.resolve();
	}
}
