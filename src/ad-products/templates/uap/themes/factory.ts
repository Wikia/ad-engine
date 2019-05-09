import { BfaaTheme, BfabTheme } from './classic';
import { BfaaHiviTheme } from './hivi/hivi-bfaa';
import { BfabHiviTheme } from './hivi/hivi-bfab';

export class BigFancyAdThemeFactory {
	makeAboveTheme(adSlot, params) {
		return params.theme === 'hivi'
			? new BfaaHiviTheme(adSlot, params)
			: new BfaaTheme(adSlot, params);
	}

	makeBelowTheme(adSlot, params) {
		return params.theme === 'hivi'
			? new BfabHiviTheme(adSlot, params)
			: new BfabTheme(adSlot, params);
	}
}

export const bfaThemeFactory = new BigFancyAdThemeFactory();
