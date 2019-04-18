class ViewportConflictAd {
	constructor() {
		this.pageLink = 'slots/viewport-conflicts/';
		this.hideBoxadButton = '#hideTopBoxad';
		this.addParagraphButton = '#addParagraph';
		this.maxNewParagraphs = 10;
	}

	/**
	 * Provides the parameter of paragraphs to add to the page.
	 * If the value is bigger than 10, it will be changed to 10.
	 * @param {number} paragraphs - number of paragraphs to load
	 */
	addParagraphs(paragraphs) {
		if (paragraphs > this.maxNewParagraphs) {
			paragraphs = this.maxNewParagraphs;
		}
		for (let i = 0; i < paragraphs; i += 1) {
			$(this.addParagraphButton).click();
		}
	}
}

export const viewportConflictAd = new ViewportConflictAd();
