import { Dictionary } from '../models';
import { context } from '../services/context-service';
import { logger } from './logger';

class Targeting {
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

	getTargetingBundles(bundles: Dictionary<Dictionary<string[]>>): string | string[] {
		try {
			const selectedBundles = [];

			Object.keys(bundles).forEach((key) => {
				if (this.matchesTargetingBundle(bundles[key])) {
					selectedBundles.push(key);
				}
			});

			return selectedBundles;
		} catch (e) {
			logger('targeting-bundles', 'Invalid input data!');
		}

		return [];
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
