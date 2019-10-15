export function getDomain(): { name: string; tld: string } {
	const hostname = window.location.hostname.toLowerCase();
	const pieces = hostname.split('.').filter((piece) => piece !== 'www');

	return {
		name: pieces.slice(0, -1).join(''),
		tld: pieces.slice(-1).join(''),
	};
}
