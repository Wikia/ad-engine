import { timeouts } from '../common/timeouts';

const loadAdTime = 10000;

class DelayAd {
	constructor() {
		this.pageLink = 'slots/delay/';
		this.loadAdsButton = '#clickDelay';
		this.resultAttribute = 'data-slot-result';
		this.viewedAttribute = 'data-slot-viewed';
		this.adLoaded = 'success';
		this.adViewed = 'true';
	}

	/**
	 * Waits for the delay to pass so the ads load up.
	 */
	waitToLoadAds() {
		browser.waitUntil(
			() =>
				$(this.loadAdsButton)
					.getText()
					.includes('Load ads ('),
			timeouts.standard,
			'Button not loaded',
			timeouts.interval,
		);
		browser.waitUntil(
			() => $(this.loadAdsButton).getText() === 'Load ads',
			loadAdTime,
			'Ads not loaded',
			timeouts.interval,
		);
	}

	loadAds() {
		$(this.loadAdsButton).waitForDisplayed(timeouts.standard);
		$(this.loadAdsButton).click();
	}
}

export const delayAd = new DelayAd();
