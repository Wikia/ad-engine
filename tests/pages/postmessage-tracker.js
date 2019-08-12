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
}

export const postmessageTrackerPage = new PostmessageTrackerPage();
