import { timeouts } from '../common/timeouts';

class PostmessageTrackerPage {
	constructor() {
		this.pageLink = 'tracking/postmessage-tracker/';
		this.correctButtonSelector = '#correctMessage';
		this.incorrectButtonSelector = '#incorrectMessage';
		this.correctSerializedButtonSelector = '#correctMessageSerialized';
		this.counterSelector = '#messageCount';
	}

	getMessageCount() {
		return $(this.counterSelector).getText();
	}

	checkNumberOfMessages(expectedNumber, errorMessage = 'Incorrect number') {
		browser.waitUntil(
			() => this.getMessageCount() === `${expectedNumber}`,
			timeouts.standard,
			errorMessage,
		);
	}
}

export const postmessageTrackerPage = new PostmessageTrackerPage();
