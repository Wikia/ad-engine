import { timeouts } from '../common/timeouts';

export class UtilsDetectors {
	constructor() {
		this.pageLink = 'utils/';
		this.messageField = '';
	}

	checkIfMessageLoaded(message) {
		return !message.includes('Waiting');
	}

	waitForDetectorToLoad() {
		browser.waitUntil(
			() => this.checkIfMessageLoaded($(this.messageField).getText()),
			timeouts.standard,
		);
	}

	getDetectorResponse() {
		$(this.messageField).waitForExist(timeouts.standard);
		this.waitForDetectorToLoad();

		return $(this.messageField).getText();
	}
}

export const utilsDetectors = new UtilsDetectors();
