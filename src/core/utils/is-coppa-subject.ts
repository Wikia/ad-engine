import { utils } from '../index';
import { context, CookieStorageAdapter } from '../services';

export function isCoppaSubject(): boolean {
	if (context.get('services.ageGateHandling')) {
		try {
			const cookieStorage = new CookieStorageAdapter();
			const ageGateResult = cookieStorage.getItem('age_gate');
			if (ageGateResult) {
				const [dialogShown, adult] = ageGateResult.split('|');
				return dialogShown === '1' ? adult === '0' : context.get('wiki.targeting.directedAtChildren');
			}
		} catch (e) {
			utils.logger('age-gate', 'Error while reading age gate cookie');
		}
	}

	return context.get('wiki.targeting.directedAtChildren');
}
