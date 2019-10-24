import { timeouts } from './timeouts';

const aspectRatioDelta = 3;
const comparisonOffsetPx = 5;

class AdSlots {
	constructor() {
		this.topLeaderboard = '#top_leaderboard';
		this.bottomLeaderboard = '#bottom_leaderboard';
		this.topBoxad = '#top_boxad';
		this.incontentBoxad = '#incontent_boxad';
		this.injectedBoxad = '#injected_boxad';
		this.incontentPlayer = '#incontent_player';
		this.invisibleHighImpact = '#invisible_high_impact_2';

		this.resultAttribute = 'data-slot-result';
		this.viewedAttribute = 'data-slot-viewed';
		this.adLoaded = 'success';
		this.adViewed = 'true';
		this.adCollapsed = 'collapse';
		this.defaultMobileRatio = 1.77;
		this.resolvedMobileRatio = 3;
	}

	waitForSlotExpanded(adSlot) {
		browser.waitUntil(
			() => $(adSlot).getSize('height') > 0,
			timeouts.standard,
			'Element not expanded',
			timeouts.interval,
		);
	}

	waitForSlotCollapsedManually(adSlot) {
		browser.waitUntil(
			() => $(adSlot).getSize('height') < 2,
			timeouts.standard,
			'Element not expanded',
			timeouts.interval,
		);
	}

	waitForSlotCollapsed(adSlot) {
		browser.waitUntil(
			() => $(adSlot).getAttribute(this.resultAttribute) === this.adCollapsed,
			timeouts.standard,
			'Slot did not collapse',
			timeouts.interval,
		);
	}

	waitForSlotViewed(adSlot) {
		browser.waitUntil(
			() => $(adSlot).getAttribute(this.viewedAttribute) === this.adViewed,
			timeouts.standard,
			'Slot has not been viewed',
			timeouts.interval,
		);
	}

	/**
	 * Waits for the adslot\'s "data-slot-result" attribute to receive desired parameter.
	 * @param adSlot slot to receive the parameter
	 * @param expectedResult parameter that result should equal to
	 */
	waitForSlotResult(adSlot, expectedResult) {
		browser.waitUntil(
			() => $(adSlot).getAttribute(this.resultAttribute) === expectedResult,
			timeouts.standard,
			`Result mismatch: expected ${expectedResult}, got ${$(adSlot).getAttribute(
				this.resultAttribute,
			)}`,
			timeouts.interval,
		);
	}

	/**
	 * Calculates height based on the actual width and given ratio.
	 * @param adSlot slot to measure
	 * @param heightRatio ratio to use as a divider
	 * @returns {number} slot\'s height
	 */
	calculateHeightWithRatio(adSlot, heightRatio) {
		const slotSize = $(adSlot).getSize();

		return slotSize.width / heightRatio;
	}

	/**
	 * Checks the slot\'s dimensions using ratio to measure height.
	 * @param adSlot slot dimensions are taken from
	 * @param expectedWidth correct slot\'s width
	 * @param heightRatio slot's ratio to measure height
	 * @returns {{status: boolean, capturedErrors: string}} status: true if there were no errors,
	 * false if errors were found; capturedErrors: error message.
	 */

	checkSlotRatio(adSlot, expectedWidth, heightRatio) {
		let result = true;
		let error = '';

		const slotSize = $(adSlot).getSize();

		if (slotSize.width !== expectedWidth) {
			result = false;
			error += `Slot width incorrect - expected ${expectedWidth} - actual ${slotSize.width}\n`;
		}

		if (
			Math.abs(slotSize.height - this.calculateHeightWithRatio(adSlot, heightRatio)) >
			aspectRatioDelta
		) {
			result = false;
			error += `Slot height incorrect - expected ${expectedWidth / heightRatio} - actual ${
				slotSize.height
			}\n`;
		}

		return {
			status: result,
			capturedErrors: error,
		};
	}

	isSlotHeightRatioCorrect(adSlot, ratio) {
		const slotActualHeight = $(adSlot).getSize('height');
		const slotExpectedHeight = this.calculateHeightWithRatio(adSlot, ratio);

		return slotActualHeight >= slotExpectedHeight - comparisonOffsetPx;
	}

	/**
	 * Takes slot size and its ratio and waits for the desired dimensions.
	 * @param adSlot Slot to take dimensions from
	 * @param ratio value to divide by
	 */
	waitForSlotResolved(adSlot, ratio) {
		browser.waitUntil(
			() => this.isSlotHeightRatioCorrect(adSlot, ratio),
			timeouts.standard,
			'Dimensions not changed',
			timeouts.interval,
		);
	}

	/**
	 * Checks UAP slot size based on the given ratio.
	 * @param adSlot slot to measure
	 * @param heightRatio ratio value for height of the slot
	 * @returns {{status: boolean, capturedErrors: string}} returns false if no errors were found,
	 * else returns true. captured errors: returns string with errors
	 */
	checkUAPSizeSlotRatio(adSlot, heightRatio) {
		this.waitForSlotExpanded(adSlot);
		let windowSize = browser.getWindowSize();

		return this.checkSlotRatio(adSlot, windowSize.width, heightRatio);
	}
}

export const adSlots = new AdSlots();
