export function getPageType(): string {
	const pathName = window.location.pathname;
	const hostname = window.location.hostname.toLowerCase();
	const pieces = hostname.split('.').filter((piece) => piece !== 'www');

	if (pieces[0] === 'old') {
		return 'old';
	}

	return !pathName || pathName === '/' ? 'home' : 'main';
}
