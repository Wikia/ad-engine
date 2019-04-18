class Moat {
	constructor() {
		this.pageLink = 'services/moat-yi/';
		this.pageParams = '#pageParams';
	}

	getPageLevelParams() {
		return $(this.pageParams).getText();
	}
}

export const moat = new Moat();
