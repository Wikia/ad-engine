export const isOnBrowser = () =>
	typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const isLocalHost = () =>
	/^localhost/.test(window.location.hostname) || window.location.hostname === '127.0.0.1';

export function isPathfinderLiteDebug() {
	return window.location.search.includes('pf_debug');
}

export function isGenericDebug() {
	return window.location.search.includes('debug');
}

export function isOnDevDomain() {
	return /fandom-dev\.(pl|us)$/.test(window.location.hostname);
}

export function isDebug(override = false) {
	if (override) {
		return override;
	}

	// if its server side do a special check
	if (!isOnBrowser() && ENV !== 'production') {
		return true;
	}

	if (isLocalHost()) {
		return true;
	}

	if (isOnDevDomain()) {
		return true;
	}

	if (isPathfinderLiteDebug()) {
		return true;
	}

	if (isGenericDebug()) {
		return true;
	}

	return false;
}
