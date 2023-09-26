export function getServicesBaseURL() {
	const fandomDomains = [
		'fandom.com',
		'tvguide.com',
		'metacritic.com',
		'gamespot.com',
		'giantbomb.com',
		'muthead.com',
		'futhead.com',
		'fandom-ae-assets.s3.amazonaws.com',
		'fanatical.com',
	];

	return fandomDomains.find((domain) => window.location.hostname.includes(domain))
		? 'https://services.fandom.com/'
		: 'https://services.fandom-dev.' +
				(location.hostname.match(/(?!\.)(pl|us)$/) || ['us'])[0] +
				'/';
}
