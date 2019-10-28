import { expect } from 'chai';
import { injectedAds } from '../../pages/injected-ad.page';
import { helpers } from '../../common/helpers';
import { slots } from '../../common/slot-registry';

describe('Injected slots: injected boxad', () => {
	before(() => {
		helpers.navigateToUrl(injectedAds.pageLink);
		helpers.mediumScroll(500);
		slots.injectedBoxad.scrollIntoView();
		slots.injectedBoxad.waitForDisplayed();
	});

	it('Check if dimensions are correct', () => {
		expect(slots.injectedBoxad.size.height).to.equal(injectedAds.injectedBoxadData.height);
		expect(slots.injectedBoxad.size.width).to.equal(injectedAds.injectedBoxadData.width);
	});
});
