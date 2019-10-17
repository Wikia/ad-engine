import { expect } from 'chai';
import { repeatableSlots } from '../../pages/repeatable-slots.page';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';
import { adSlots } from '../../common/ad-slots';
import { slots } from '../../common/slot-registry';

describe('Repeatable slots ads', () => {
	before(() => {
		helpers.navigateToUrl(repeatableSlots.pageLink);
	});

	beforeEach(() => {
		slots.repeatableBoxad1.waitForDisplayed();
	});

	it('Check if first repeatable slot is visible', () => {
		expect(slots.repeatableBoxad1.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if last slot is visible with a limit to 4', () => {
		const numberOfSlots = 4;
		const lengthOfContent = 10;

		const expectedSlots = [
			slots.repeatableBoxad1,
			slots.repeatableBoxad2,
			slots.repeatableBoxad3,
			slots.repeatableBoxad4,
		];

		helpers.navigateToUrl(
			repeatableSlots.pageLink,
			queryStrings.getLengthOfContent(lengthOfContent),
			queryStrings.getLimitOfSlots(numberOfSlots),
		);

		expectedSlots.forEach((slot) => {
			slot.scrollIntoView();
			slot.waitForDisplayed();
			helpers.mediumScroll(2250); //move to variable
		});

		expect(slots.repeatableBoxad5.isDisplayed(), '9th slot is visible').to.be.false;
	});

	it('Check if 8th boxad is visible', () => {
		const lengthOfContent = 10;
		const expectedSlots = [
			slots.repeatableBoxad1,
			slots.repeatableBoxad2,
			slots.repeatableBoxad3,
			slots.repeatableBoxad4,
			slots.repeatableBoxad5,
			slots.repeatableBoxad6,
			slots.repeatableBoxad7,
			slots.repeatableBoxad8,
		];

		helpers.navigateToUrl(
			repeatableSlots.pageLink,
			queryStrings.getLengthOfContent(lengthOfContent),
		);

		expectedSlots.forEach((slot) => {
			slot.scrollIntoView();
			slot.waitForDisplayed();
			helpers.mediumScroll(2250); //move to variable
		});

		expect(slots.repeatableBoxad9.isDisplayed(), '9th slot is visible').to.be.false;
	});

	it('Check if there is at least one viewport between slots', () => {
		helpers.navigateToUrl(repeatableSlots.pageLink, queryStrings.getLengthOfContent());
		slots.repeatableBoxad1.waitForDisplayed();
		slots.repeatableBoxad1.scrollIntoView();
		helpers.mediumScroll(2250); //move to variable
		slots.repeatableBoxad2.waitForExist();
		slots.repeatableBoxad2.scrollIntoView();
		helpers.mediumScroll(2250); //move to variable
		slots.repeatableBoxad3.waitForExist();
		slots.repeatableBoxad3.scrollIntoView();
		helpers.mediumScroll(adSlots.boxadHeight + 50);

		expect(slots.repeatableBoxad2.isDisplayedInViewport()).to.be.false;
		expect(slots.repeatableBoxad3.isDisplayedInViewport()).to.be.false;
	});
});
