export class PlacementsBuilder {
	public buildReactionDivModule(postUniqueId: string): Element {
		const divElement = document.createElement('div');
		divElement.dataset.spotimApp = 'reactions';
		divElement.dataset.postId = postUniqueId;
		divElement.dataset.vertivalView = 'true';

		return divElement;
	}

	public buildStandaloneAdUnit(): Element {
		const divElement = document.createElement('div');
		divElement.dataset.openwebAd = '';
		divElement.dataset.row = '1';
		divElement.dataset.column = '1';
		divElement.classList.add('openweb-ad-unit');

		return divElement;
	}
}
