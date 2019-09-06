import { ScrollSpeedCalculator } from '@wikia/ad-engine/services/scroll-speed-calculator';
import { expect } from 'chai';

describe('Scroll speed calculator', () => {
	const scrollSpeedCalculator = ScrollSpeedCalculator.make();

	it('session scroll speed and page views are 0 at the beginning', () => {
		expect(scrollSpeedCalculator.getAverageSessionScrollSpeed()).to.equal(0);
		expect(scrollSpeedCalculator.getScrollSpeedRecordsNumber()).to.equal(0);
	});

	it('scroll speed and page views are calculated properly', () => {
		scrollSpeedCalculator.setAverageSessionScrollSpeed([300, 350]);
		expect(scrollSpeedCalculator.getAverageSessionScrollSpeed()).to.equal(325);
		expect(scrollSpeedCalculator.getScrollSpeedRecordsNumber()).to.equal(1);

		scrollSpeedCalculator.setAverageSessionScrollSpeed([0]);
		expect(scrollSpeedCalculator.getAverageSessionScrollSpeed()).to.equal(163);
		expect(scrollSpeedCalculator.getScrollSpeedRecordsNumber()).to.equal(2);

		scrollSpeedCalculator.setAverageSessionScrollSpeed([-13]);
		expect(scrollSpeedCalculator.getAverageSessionScrollSpeed()).to.equal(104);
		expect(scrollSpeedCalculator.getScrollSpeedRecordsNumber()).to.equal(3);
	});
});
