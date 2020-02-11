import { expect } from 'chai';
import { timeouts } from './timeouts';
import { queryStrings } from './query-strings';
import { navbarPage } from '../pages/navbar.page';

const valueToDivideBy = 10;
const pauseBetweenScrollsShort = 100;
const pauseBetweenScrolls = 500;
const timeToStartPlaying = 3000;

class Helpers {
	constructor() {
		this.classHidden = '.hide';
		this.classProperty = 'class';
		this.main = '.main';
		this.navbar = 'nav';
		this.clickThroughUrlDomain = 'fandom';
		this.wrapper = '.wrapper:first-of-type';
		this.slotResult = 'data-slot-result';
	}

	/**
	 * Waits for the URL provided as the parameter.
	 * @param {string} newUrl - URL we are waiting for
	 */
	waitForUrl(newUrl) {
		browser.waitUntil(
			() => RegExp(newUrl).test(browser.getUrl()),
			timeouts.newUrlTimeout,
			'expected new page after 10 seconds',
			timeouts.interval,
		);
	}

	waitForViewabillityCounted(timeout = timeouts.viewabillity) {
		browser.pause(timeout);
	}

	navigateToUrl(url, ...parameters) {
		browser.url(queryStrings.getUrl(url, ...parameters));
	}

	/**
	 * Scrolls by given number of pixels starting from the given element.
	 * If no element is given, it scrolls from the top.
	 * @param {number} px - number of pixels by which we want to scroll
	 * @param scrollFromThisElement - element we want to scroll from
	 */
	slowScroll(px, scrollFromThisElement = null) {
		const step = px / valueToDivideBy;

		if (scrollFromThisElement !== null) {
			$(scrollFromThisElement).scrollIntoView();
			for (let i = step; Math.abs(i) < Math.abs(px); i += step) {
				browser.execute(`window.scrollBy(0,${step})`);
				browser.pause(pauseBetweenScrolls);
			}
		} else {
			for (let i = step; Math.abs(i) < Math.abs(px); i += step) {
				browser.execute(`window.scrollBy(0,${step})`);
				browser.pause(pauseBetweenScrolls);
			}
		}
	}

	mediumScroll(px) {
		const step = px / valueToDivideBy;
		for (let i = step; Math.abs(i) < Math.abs(px); i += step) {
			browser.execute(`window.scrollBy(0,${step})`);
			browser.pause(pauseBetweenScrollsShort);
		}
	}

	fastScroll(px, scrollFromThisElement = null) {
		if (scrollFromThisElement !== null) {
			$(scrollFromThisElement).scrollIntoView();
			browser.execute(`window.scrollBy(0,${px})`);
		} else {
			browser.execute(`window.scrollBy(0,${px})`);
		}
	}

	scrollUpByNavbarHeight() {
		this.mediumScroll(-navbarPage.height - 5);
	}

	waitToStartPlaying() {
		browser.pause(timeToStartPlaying);
	}

	reloadPageAndWaitForSlot(adSlot) {
		browser.refresh();
		$(adSlot).waitForDisplayed(timeouts.standard);
	}

	openUrlAndWaitForSlot(url, adSlot) {
		this.navigateToUrl(url);
		$(adSlot).waitForDisplayed(timeouts.standard);
	}

	refreshPageAndWaitForSlot(adSlot, timeout = timeouts.standard) {
		browser.refresh();
		browser.pause(timeout);
		$(adSlot).waitForDisplayed(timeout);
	}

	waitForAnimations() {
		browser.pause(timeouts.actions);
	}

	waitForVideoAdToFinish(adDuration) {
		browser.pause(adDuration);
	}

	waitForVideoToProgress(videoDuration) {
		browser.pause(videoDuration);
	}

	waitForValuesLoaded(field) {
		return browser.waitUntil(
			() =>
				!$(field || this.main)
					.getText()
					.includes('Waiting...'),
			timeouts.standard,
		);
	}

	getLocationRelativeToViewport(selector) {
		return browser.execute(
			(givenSelector) => document.querySelector(givenSelector).getBoundingClientRect().y,
			selector,
		);
	}

	/**
	 * Switches focus to a given frame. If you want to go back to default frame, use browser.frame()
	 * instead.
	 * @param frameID name of the frame to change focus to
	 */
	switchToFrame(frameID) {
		const frame = $(frameID).value;

		browser.switchToFrame(frame);
	}

	switchToTab(tabId = 1) {
		// TODO remove this workaround after chromedriver update for opening new pages
		browser.pause(timeouts.standard);

		browser.switchToFrame(tabId);
	}

	/**
	 * Closes all the tabs but the first one and switches back to it.
	 */
	closeNewTabs() {
		const handles = browser.getWindowHandles();
		const mainWindow = handles.shift();

		handles.forEach((window) => {
			browser.switchToWindow(window);
			browser.closeWindow();
		});
		browser.switchToWindow(mainWindow);
	}

	// TODO Visual
	checkVisualRegression(results) {
		results.forEach((result) => expect(result.isWithinMisMatchTolerance).to.be.ok);
	}
}

export const helpers = new Helpers();
