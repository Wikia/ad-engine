import { postmessageTrackerPage } from '../../pages/postmessage-tracker';
import { helpers } from '../../common/helpers';

describe('PostmessageTracker', () => {
	const page = postmessageTrackerPage;

	beforeEach(() => {
		helpers.navigateToUrl(page.pageLink);
		page.checkNumberOfMessages(0, 'Page set up incorrectly');
	});

	it('should handle correct message (raw object)', () => {
		$(page.correctButtonSelector).click();
		page.checkNumberOfMessages(1);
	});

	it('should handle correct message (serialized object)', () => {
		$(page.correctSerializedButtonSelector).click();
		page.checkNumberOfMessages(1);
	});

	it('should not catch incorrect message', () => {
		$(page.incorrectButtonSelector).click();
		page.checkNumberOfMessages(0);
	});
});
