import { timeouts } from '../common/timeouts';

const loadAdTime = 10000;

class DelayAd {
	constructor() {
		this.pageLink = 'slots/delay/';
		this.loadAdsButton = '#clickDelay';
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
}

export const delayAd = new DelayAd();
