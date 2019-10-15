export function getPageType(): string {
	const pathName = window.location.pathname;

	return !pathName || pathName === '/' ? 'home' : 'main';
}
