import { utils } from '../index';
import { context, CookieStorageAdapter } from '../services';

export function isCoppaSubject(): boolean {
	const wikiDirectedAtChildren = context.get('wiki.targeting.directedAtChildren');
	if (context.get('services.ageGateHandling') && wikiDirectedAtChildren) {
		try {
			const cookieStorage = new CookieStorageAdapter();
			const ageGateResult = cookieStorage.getItem('age_gate');
			if (ageGateResult) {
				const [dialogShown, adult] = ageGateResult.split('|');
				return dialogShown === '1' ? adult === '0' : wikiDirectedAtChildren;
			}
		} catch (e) {
			utils.logger('age-gate', 'Error while reading age gate cookie');
		}
	}

	return wikiDirectedAtChildren;
}
