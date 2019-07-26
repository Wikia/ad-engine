import { utils } from '@ad-engine/core';
import { InstantConfigGroup, negativePrefix } from '../instant-config.models';
import { extractNegation } from './negation-extractor';

export class BrowserMatcher {
	currentBrowser: string = utils.client.getBrowser();

	isProperBrowser(browsers: InstantConfigGroup['browsers'] = []): boolean {
		if (browsers.length === 0) {
			return true;
		}

		if (browsers.includes(`${negativePrefix}${this.currentBrowser}`)) {
			return false;
		}

		return browsers
			.map((device) => extractNegation(device))
			.some((object) => this.currentBrowser.includes(object.value) !== object.negated);
	}
}
