import * as Cookies from 'js-cookie';
import { logger, queryString } from '.';
import { CookieStorageAdapter } from '../services';

const cookieStorage = new CookieStorageAdapter();

export function isDebugMode(): boolean {
	return Boolean(getDebugGroup());
}

export function getDebugGroup(): string {
	return queryString.get('adengine_debug') || Cookies.get('adengine_debug');
}

export function setDebugMode(groups: string | null) {
	groups !== null
		? cookieStorage.setItem('adengine_debug', groups || '1')
		: cookieStorage.removeItem('adengine_debug');
	logger('ad-engine', `AdEngine Debug Mode ${groups !== null ? 'enabled' : 'disabled'}`);
}

export const debug = {
	isDebugMode,
	getDebugGroup,
	setDebugMode,
};

window.ads = window.ads || ({} as any);
window.ads.debug = setDebugMode;
