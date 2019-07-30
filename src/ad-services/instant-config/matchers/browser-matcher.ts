import { utils } from '@ad-engine/core';
import { InstantConfigGroup } from '../instant-config.models';
import { extractNegation, NegationObject } from './negation-extractor';

export class BrowserMatcher {
	private currentBrowser: string = utils.client.getBrowser().toLowerCase();

	isValid(browsers: InstantConfigGroup['browsers'] = []): boolean {
		const browserObjects = browsers
			.map((browser) => browser.toLowerCase())
			.map((browser) => extractNegation(browser));

		if (browsers.length === 0) {
			return true;
		}

		if (this.isCurrentNegated(browserObjects)) {
			return false;
		}

		return browserObjects.some(
			(object) => this.currentBrowser.includes(object.value) !== object.negated,
		);
	}

	private isCurrentNegated(browserObjects: NegationObject[]): boolean {
		return browserObjects.some(
			(object) => this.currentBrowser.includes(object.value) && object.negated,
		);
	}
}
