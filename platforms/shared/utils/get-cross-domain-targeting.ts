import { CookieStorageAdapter } from '@wikia/ad-engine';

export function getCrossDomainTargeting(crossDomainStorage: CookieStorageAdapter) {
	return {
		'cortex-visitor': crossDomainStorage.getItem('adeng-cortex-rpg-visited') ? 'yes' : 'no',
	};
}
