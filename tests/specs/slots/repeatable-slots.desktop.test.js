import { expect } from 'chai';
import { repeatableSlots } from '../../pages/repeatable-slots.page';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';
import { adSlots } from '../../common/ad-slots';
import { slots } from '../../common/slot-registry';

describe('Repeatable slots ads', () => {
	let adStatus;

	before(() => {
		helpers.navigateToUrl(repeatableSlots.pageLink);
		adStatus = slots.repeatableBoxad1.status;
	});

	beforeEach(() => {
		$(repeatableSlots.getRepeatableSlotSelector(1)).waitForDisplayed(timeouts.standard);
	});

	it('Check if first boxad is visible', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if last slot is visible with a limit to 4', () => {
		const numberOfSlots = 4;
		const lengthOfContent = 5;

		helpers.navigateToUrl(
			repeatableSlots.pageLink,
			queryStrings.getLimitOfSlots(numberOfSlots),
			queryStrings.getLengthOfContent(lengthOfContent),
		);
		$(repeatableSlots.getRepeatableSlotSelector(1)).waitForDisplayed(timeouts.standard);
		for (let i = 1; i < numberOfSlots; i += 1) {
			repeatableSlots.scrollBetweenBoxads(repeatableSlots.getRepeatableSlotSelector(i));
			expect(
				$(repeatableSlots.getRepeatableSlotSelector(i + 1)).isDisplayed(),
				`Slot number ${i + 1} is not visible`,
			).to.be.true;
		}
		repeatableSlots.scrollBetweenBoxads(repeatableSlots.getRepeatableSlotSelector(numberOfSlots));
		expect(
			$(repeatableSlots.getRepeatableSlotSelector(numberOfSlots + 1)).isDisplayed(),
			'Slot not visible',
		).to.be.false;
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
