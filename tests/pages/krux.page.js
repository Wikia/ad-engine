class Krux {
	constructor() {
		this.pageLink = 'services/krux/';
		this.idField = '#user';
		this.segmentsField = '#segments';
	}

	getUserID() {
		return $(this.idField).getText();
	}

	getSegments() {
		return $(this.segmentsField).getText();
	}
}

export const krux = new Krux();
