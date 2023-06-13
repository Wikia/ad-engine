import { GlobalContextCategories, globalContextService, utils } from '../index';
import { context, CookieStorageAdapter } from '../services';

export function isCoppaSubject(): boolean {
	const wikiDirectedAtChildren = context.get('wiki.targeting.directedAtChildren');
	if (context.get('services.ageGateHandling') && wikiDirectedAtChildren) {
		try {
			const contextValue = globalContextService.getValue(
				GlobalContextCategories.partners,
				'directedAtChildren',
			);
			if (contextValue === undefined) {
				const cookieStorage = new CookieStorageAdapter();
				const ageGateResult = cookieStorage.getItem('ag');
				const isCoppaSubject = ageGateResult === '1' ? false : wikiDirectedAtChildren;

				globalContextService.setValue(GlobalContextCategories.partners, {
					directedAtChildren: !!isCoppaSubject,
					blockthrough: {
						directedAtChildren: !!isCoppaSubject,
					},
				});
				return isCoppaSubject;
			} else {
				return contextValue;
			}
		} catch (e) {
			utils.logger('age-gate', 'Error while reading age gate cookie');
		}
	}

	globalContextService.setValue(GlobalContextCategories.partners, {
		directedAtChildren: wikiDirectedAtChildren,
		blockthrough: {
			directedAtChildren: !!isCoppaSubject,
		},
	});
	return wikiDirectedAtChildren;
}
