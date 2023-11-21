import {
	BaseServiceSetup,
	context,
	getAdUnitString,
	targetingService,
	utils,
} from '@wikia/ad-engine';

export class TaglessRequestSetup extends BaseServiceSetup {
	private logGroup = 'tagless-request';

	async call(): Promise<void> {
		const pageTargeting = targetingService.dump();

		const videoTaglessRequestUrl = utils.buildVastUrl(16 / 9, 'video', {
			videoAdUnitId: getAdUnitString('featured', {
				...context.get('slots.featured'),
				slotNameSuffix: '',
			}),
			customParams: `src=${context.get('src')}&pos=featured&cid=${pageTargeting['cid']}`,
		});

		utils.logger(this.logGroup, 'Sending a tagless request: ', videoTaglessRequestUrl);
		await fetch(videoTaglessRequestUrl)
			.then((res) => res.blob())
			.then((resBlob) => resBlob.text())
			.then((text) => {
				try {
					const parser = new DOMParser();
					const xml = parser.parseFromString(text, 'text/xml');
					const ads = xml.getElementsByTagName('Ad');
					const firstReturnedAdId = ads[0]?.id;
					utils.logger(this.logGroup, firstReturnedAdId);

					return Promise.resolve(firstReturnedAdId);
				} catch (e) {
					utils.logger(this.logGroup, 'No XML available - not a VAST response from the ad server?');

					return Promise.resolve(null);
				}
			});
	}
}
