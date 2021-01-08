import { queryString } from '../utils/query-string';
import { CookieStorageAdapter } from './cookie-storage-adapter';

const cookieStorage = new CookieStorageAdapter();

export function isDebugMode(): boolean {
	return Boolean(getDebugGroup());
}

export function getDebugGroup(): string {
	return queryString.get('adengine_debug') || cookieStorage.getItem('adengine_debug');
}

export function setDebugMode(groups: string | null) {
	groups !== null
		? cookieStorage.setItem('adengine_debug', groups || '1')
		: cookieStorage.removeItem('adengine_debug');
}

export const debug = {
	isDebugMode,
	getDebugGroup,
	setDebugMode,
};

window.ads = window.ads || ({} as any);
window.ads.debug = setDebugMode;
