export function getDomain(): { base: string; name: string; tld: string } {
	const hostname = window.location.hostname.toLowerCase();
	const pieces = hostname.split('.').filter((piece) => piece !== 'www');
	const piecesCount = pieces.length;

	return {
		base: pieces.slice(pieces[piecesCount - 2] === 'co' ? -3 : -2).join(''),
		name: pieces.slice(0, -1).join(''),
		tld: pieces.slice(-1).join(''),
	};
}
