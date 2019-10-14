import { expect } from 'chai';
import { navbarPage } from '../pages/navbar.page';
import { helpers } from './helpers';
import { timeouts } from './timeouts';

export class AdSlot {
	resultAttribute = 'data-slot-result';

	get element() {
		return $(this.selector);
	}

	get slotName() {
		return this.config.slotName;
	}

	get selector() {
		return this.config.selector || `#${this.slotName}`;
	}

	get lineItemId() {
		return this.element.getAttribute('data-gpt-line-item-id');
	}

	get creativeId() {
		return this.element.getAttribute('data-gpt-creative-id');
	}

	get position() {
		return this.config.position || this.slotName;
	}

	get size() {
		return this.element.getSize();
	}

	get iframeId() {
		return $(`${this.element} iframe[id^="google_ads_iframe_/5441/"]`).value;
	}

	get relativeLocationToViewport() {
		return browser.execute(
			(givenSelector) => document.querySelector(givenSelector).getBoundingClientRect().y,
			this.selector,
		);
	}

	constructor(config) {
		this.config = config;
	}

	hasChildren() {
		return this.element.$$('*').length > 0;
	}

	isDisplayed() {
		return this.element.isDisplayed();
	}

	isDisplayedInViewport() {
		return this.element.isDisplayedInViewport();
	}

	isExisting() {
		return this.element.isExisting();
	}

	waitForDisplayed(timeout = timeouts.standard, reverse = false) {
		return this.element.waitForDisplayed(timeout, reverse);
	}

	waitForDisplayedInViewport(timeout = timeouts.standard) {
		browser.waitUntil(
			() => this.isDisplayedInViewport(),
			timeout,
			`Element not displayed in viewport.`,
			timeouts.interval,
		);
	}

	waitForLineItemIdAttribute() {
		browser.waitUntil(
			() => this.lineItemId !== null,
			timeouts.standard,
			`Element has no line item.`,
			timeouts.interval,
		);
	}

	waitForExist(timeout = timeouts.standard) {
		this.element.waitForExist(timeout);
	}

	scrollIntoView() {
		// Element has to be visible in order to scroll into it
		// In case of hidden slot by default we need to define
		// surrounding visible element
		const selector = this.config.scrollTrigger || this.selector;

		$(selector).scrollIntoView(false);
		browser.execute(`window.scrollBy(0, ${-navbarPage.height})`);
		// Trigger real scroll for lazy-loaded slots
		if (this.config.isLazyLoaded) {
			helpers.slowScroll(10);
		}
	}

	getAspectRatio() {
		return this.getWidth() / this.getHeight();
	}

	getHeight() {
		return this.element.getSize('height');
	}

	getWidth() {
		return this.element.getSize('width');
	}

	/**
	 * Waits for the adslot\'s "data-slot-result" attribute
	 *
	 * If param "result" is supplied, it waits until parameter has desired value.
	 * @param expected parameter that result should equal to
	 */
	waitForSlotResult(expected) {
		browser.waitUntil(
			() => this.element.getAttribute(this.resultAttribute) !== null,
			timeouts.standard,
			`Result attribute has not been set.`,
			timeouts.interval,
		);

		if (expected) {
			const result = this.element.getAttribute(this.resultAttribute);

			expect(result).to.equal(
				expected,
				`Expected ${this.resultAttribute} to equal "${expected}" but it is ${result}.`,
			);
		}
	}
}
