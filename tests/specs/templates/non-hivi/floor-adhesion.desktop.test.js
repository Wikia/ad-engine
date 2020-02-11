import { expect } from 'chai';
import { floorAdhesion } from '../../../pages/floor-adhesion.page';
import { helpers } from '../../../common/helpers';
import { queryStrings } from '../../../common/query-strings';
import { slots } from '../../../common/slot-registry';

describe('Floor adhesion page: floor adhesion', () => {
	beforeEach(() => {
		helpers.navigateToUrl(floorAdhesion.pageLink, queryStrings.getCampaign(floorAdhesion.cid));
		slots.floorAdhesion.waitForDisplayed();
	});

	it('Check if floor adhesion scrolls with the viewport', () => {
		expect(slots.floorAdhesion.isDisplayedInViewport(), 'Slot is not in the viewport').to.be.true;

		helpers.mediumScroll(1500);

		expect(slots.floorAdhesion.isDisplayedInViewport(), 'Slot is not in the viewport after scroll')
			.to.be.true;
	});

	it('Check if floor adhesion disappears after clicking close button', () => {
		expect(slots.floorAdhesion.isDisplayedInViewport(), 'Slot is not in the viewport').to.be.true;

		$(floorAdhesion.closeButton).click();

		expect(slots.floorAdhesion.isDisplayedInViewport(), 'Slot is still in the viewport').to.be
			.false;
	});
});
