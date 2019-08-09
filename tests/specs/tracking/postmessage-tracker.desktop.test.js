import { postmessageTrackerPage } from '../../pages/postmessage-tracker';
import { timeouts } from '../../common/timeouts';

describe('PostmessageTracker', () => {
	const page = postmessageTrackerPage;

	beforeEach(() => {
		browser.url(page.pageLink);
		browser.waitUntil(
			() => page.getMessageCount() === '0',
			timeouts.standard,
			'Page set up incorrectly',
		);
	});

	it('should handle correct message (raw object)', () => {
		$(page.correctButtonSelector).click();
		browser.waitUntil(() => page.getMessageCount() === '1', timeouts.standard);
	});

	it('should handle correct message (serialized object)', () => {
		$(page.correctSerializedButtonSelector).click();
		browser.waitUntil(() => page.getMessageCount() === '1', timeouts.standard);
	});

	it('should not catch incorrect message', () => {
		$(page.incorrectButtonSelector).click();
		browser.waitUntil(() => page.getMessageCount() === '0', timeouts.standard);
	});
});
