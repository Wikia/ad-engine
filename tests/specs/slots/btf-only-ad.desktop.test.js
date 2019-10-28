import { expect } from 'chai';
import { btfOnlyAd } from '../../pages/btf-only-ad.page';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { slots } from '../../common/slot-registry';

describe('BTF Only ads page: incontent boxad', () => {
	before(() => {
		helpers.navigateToUrl(btfOnlyAd.pageLink);
		$(btfOnlyAd.finishQueueButton).waitForDisplayed(timeouts.standard);
		$(btfOnlyAd.finishQueueButton).click();
		slots.incontentBoxad.scrollIntoView();
		slots.incontentBoxad.waitForDisplayed();
	});

	it('Check if boxad is visible and in viewport after clicking on the button', () => {
		expect(slots.incontentBoxad.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});
});
