import { context, CookieStorageAdapter } from '../services';

export function isCoppaSubject(): boolean {
	if (!context.get('services.ageGateHandling')) {
		return context.get('wiki.targeting.directedAtChildren');
	} else {
		try {
			const cookieStorage = new CookieStorageAdapter();
			const ageGateResult = cookieStorage.getItem('age_gate');
			if (ageGateResult) {
				const [dialogShown, adult] = ageGateResult.split('|');
				return dialogShown ? adult === '0' : context.get('wiki.targeting.directedAtChildren');
			}
		} catch (e) {
			return context.get('wiki.targeting.directedAtChildren');
		}
	}
}
