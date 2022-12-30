import { Dictionary } from '../models';
import { CookieStorageAdapter } from '../services/';
import { context } from '../services/context-service';
import { logger } from './logger';

/*
 *  ToDo: Development improvement refactor
 *  This class is about to be expanded in ADEN-10310
 */
class Targeting {
	private static containsValue(valuesList: string[], value: string): boolean {
		const upperValue = value.toUpperCase();
		return valuesList.some((existingBundle) => existingBundle.toUpperCase() === upperValue);
	}

	getHostnamePrefix(): string {
		const hostname = window.location.hostname.toLowerCase();
		const match = /(^|.)(showcase|externaltest|preview|verify|stable|sandbox-[^.]+)\./.exec(
			hostname,
		);

		if (match && match.length > 2) {
			return match[2];
		}

		const pieces = hostname.split('.');

		if (pieces.length) {
			return pieces[0];
		}

		return undefined;
	}

	getRawDbName(wikiDbName: string): string {
		return `_${wikiDbName || 'wikia'}`.replace('/[^0-9A-Z_a-z]/', '_');
	}

	getTargetingBundles(bundles: Dictionary<Dictionary<string[]>>): string[] {
		const targetingBundles = context.get('targeting.bundles') || [];

		try {
			const selectedBundles = [];

			Object.keys(bundles).forEach((key) => {
				if (this.matchesTargetingBundle(bundles[key])) {
					selectedBundles.push(key);
				}
			});

			selectedBundles.forEach((bundle) => {
				if (!Targeting.containsValue(targetingBundles, bundle)) {
					targetingBundles.push(bundle);
				}
			});
		} catch (e) {
			logger('targeting-bundles', 'Invalid input data!');
		}

		return this.applyCodeLevelBundles(targetingBundles);
	}

	isWikiDirectedAtChildren(): boolean {
		return context.get('wiki.targeting.directedAtChildren');
	}

	private applyCodeLevelBundles(bundles: string[]): string[] {
		const cookieAdapter = new CookieStorageAdapter();
		const shortPageWordsLimit = 100;

		if (cookieAdapter.getItem('_ae_intrsttl_imp')) {
			bundles.push('interstitial_disabled');
		}
		const skin = context.get('targeting.skin');

		if (
			skin &&
			skin.includes('ucp_') &&
			!Targeting.containsValue(bundles, 'VIDEO_TIER_1_AND_2_BUNDLE')
		) {
			bundles.push('VIDEO_TIER_3_BUNDLE');
		}

		const wordCount = context.get('targeting.word_count') || -1;

		if (wordCount > -1 && wordCount <= shortPageWordsLimit) {
			bundles.push('short_page');
			context.set('custom.short_page', true);
		}

		return bundles;
	}

	private matchesTargetingBundle(bundle: Dictionary<string[]>): boolean {
		return !Object.keys(bundle).some((key) => {
			const acceptedValues = context.get(`targeting.${key}`);

			if (!acceptedValues) {
				return true;
			}

			if (Array.isArray(acceptedValues)) {
				// @ts-ignore we check if it's an array so using .some() is OK here
				if (!bundle[key].some((find) => acceptedValues.includes(find))) {
					return true;
				}
			} else {
				if (!bundle[key].includes(acceptedValues)) {
					return true;
				}
			}

			return false;
		});
	}
}

export const targeting = new Targeting();
