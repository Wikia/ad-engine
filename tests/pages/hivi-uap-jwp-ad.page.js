import { timeouts } from '../common/timeouts';
import { helpers } from '../common/helpers';

class HiviUapJwp {
	constructor() {
		this.pageLink = '/templates/hivi-uap-jwp/';
		this.loadAdsButton = '#clickDelay';
		this.inHouseLineItemId = '271491732';
		this.uapLineItemId = '4517824948';
		this.staticFrame = '[name="google_osd_static_frame"]';
		this.videoDuration = 10000;
	}

	/**
	 * Waits for the delay to pass so the ads load up.
	 */
	waitToLoadAds() {
		browser.waitUntil(
			() =>
				$(this.loadAdsButton)
					.getText()
					.includes('Load UAP:JWP ('),
			timeouts.standard,
			'Button not loaded',
			timeouts.interval,
		);
		helpers.waitForVideoAdToFinish(this.videoDuration);
		browser.waitUntil(
			() => $(this.loadAdsButton).getText() === 'Load UAP:JWP',
			timeouts.standard,
			'Ads not loaded',
			timeouts.interval,
		);
	}

	/**
	 * Waits for the delay to pass so ads can load and scrolls to the desired ad slot.
	 * This method is desired for mobile tests.
	 * @param adSlot first ad slot/module to scroll to
	 */
	waitForAdsAfterDelayAndScrollToAdSlotOnMobile(adSlot) {
		this.waitToLoadAds();
		$(adSlot).scrollIntoView();
	}

	/**
	 *Waits for the delay to pass so ads can load and scrolls to the desired slot.
	 * This method is desired for desktop tests.
	 * @param adSlot slot we want to be visible
	 */
	waitForAdsAfterDelayAndScrollToAdSlotOnDesktop(adSlot) {
		this.waitToLoadAds();
		helpers.slowScroll(1000);
		$(adSlot).waitForDisplayed(timeouts.standard);
	}

	/**
	 * Clicks on the button to load ads. After the click, scrolls to the slot\`s approximate position.
	 * This method is desired for mobile tests.
	 * @param adSlot ad slot to scroll to
	 */
	waitForAdsAfterClickAndScrollToAdSlotOnMobile(adSlot) {
		$(this.loadAdsButton).waitForDisplayed(timeouts.standard);
		browser.waitUntil(
			() => $(this.loadAdsButton).getText() === 'Load UAP:JWP (7s)',
			timeouts.standard,
			'Button not loaded',
			timeouts.interval,
		);
		$(this.loadAdsButton).click();
		$(adSlot).scrollIntoView();
	}

	/**
	 * Clicks on the button to load ads. After the click, scrolls to the slot\'s approximate position.
	 * This method is desired for desktop tests.
	 * @param adSlot slot we want to be visible
	 */
	waitForAdsAfterClickAndScrollToAdSlotOnDesktop(adSlot) {
		$(this.loadAdsButton).waitForDisplayed(timeouts.standard);
		browser.waitUntil(
			() => $(this.loadAdsButton).getText() === 'Load UAP:JWP (7s)',
			timeouts.standard,
			'Button not loaded',
			timeouts.interval,
		);
		$(this.loadAdsButton).click();
		helpers.slowScroll(1000);
		$(adSlot).waitForDisplayed(timeouts.standard);
		$(adSlot).scrollIntoView();
	}
}

export const hiviUapJwp = new HiviUapJwp();
